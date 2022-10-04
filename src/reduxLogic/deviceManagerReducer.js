import { createSlice } from "@reduxjs/toolkit";
import { arraysAreEqual, markerToValueName, deviceTypeToString, } from "../Utils/ParseBeaconDataUtils";
import { createSummary, parseMessage, } from '../Utils/ParseDataUtils';

import { NativeModules } from 'react-native';
import { store } from "./stateStore";
const { BinaryParser } = NativeModules;

const DeviceManagerReucer = createSlice({
    name: "DeviceManager",
    initialState: {
        DeviceMap: {
            connected: [],
            connecting: [],
            available: [],
            beacons: [],
        },
        DeviceDefs: {},
        DeviceData: {},
        DeviceSettings: {},
        BluetoothData: {},
        bluetoothActive: false,
        RemoteFiles: {},
        BeaconData: {},
    },
    reducers: {
        // Triggered when a device is discovered from the bluetooth module
            // Keys: peripheralID (the bluetooth id for the device)
        discoveredDevice (state, action) {
            //console.log('Discovered device');

            // Ignore a device if there is no service UUIDs
            if (!action.payload.advertising.serviceUUIDs) {
                console.log('No service UUIDs');
                return;
            }

            // Check for the PAM service UUID
            let hasServiceUUID = false;

            action.payload.advertising.serviceUUIDs.forEach(id => {
                if (!hasServiceUUID && id == "6e400001-b5a3-f393-e0a9-e50e24dcca9e") {
                    hasServiceUUID = true;
                }
            })

            // Get device type
            let deviceType;
            if (action.payload.advertising.localName) {
                deviceType = action.payload.advertising.localName.split('-')[0].trim();
            } else {
                deviceType = '';
            }

            // Get the peripheralID
            let peripheralID = action.payload.peripheralID;

            // Check if the device already has an entry
            let isDefined = false;
            // Check by iterating over all existing device defs and check for an entry with a mathcing peripheralID
            Object.values(state.DeviceDefs).forEach(deviceDef => {
                // if isDefined is false, compare the device def peripheralID against the given one
                if (!isDefined && deviceDef.peripheralID == action.payload.peripheralID) {
                    // Peripheral ids match so the given device already has a device def
                    isDefined = true;
                }
            });

            if (!action.payload.advertising.localName) {
                //console.log('No local name');
                return;
            }

            if (action.payload.advertising.localName != action.payload.name) {
                action.payload.name = action.payload.advertising.localName;
            }

            // Handle differently depending on wether device is beacon or direct connect
            let isBeacon = action.payload.advertising.localName.includes('Beacon');

            // Do not track devices that do not have the proper UUID and is not set up as a beacon
            if ((!hasServiceUUID && !isBeacon) || !peripheralID) {
                // console.log('Ignoring: ', action);
                // console.log((!hasServiceUUID && !isBeacon), !peripheralID);
                // console.log(!hasServiceUUID, !isBeacon);
                // console.log(action.payload.advertising.localName.split('-')[0].trim());

                // Ignore device

                // console.log('No service id and not beacon: ', action.payload.advertising.localName, ' ', peripheralID);
                // console.log(hasServiceUUID, ' ', action.payload.advertising.serviceUUIDs);

                return;
            }

            // If not already defines, make a new definition
            if (!isDefined) {
                // Add the isBeacon flag to the device def object
                action.payload.isBeacon = isBeacon;
                // Create a device def for the new device
                state.DeviceDefs[peripheralID] = action.payload;
                // Create a data object for the device
                state.DeviceData[peripheralID] = {
                    Species: {},
                    batteryLevel: 0,
                    logBuffer: [],
                    header: '',
                    dataLines: [],
                };
                // Create a setting object for the device
                state.DeviceSettings = [];
                // Create a bluetooth data object for the device
                state.BluetoothData[peripheralID] = {
                    ReadBuffer: "", 
                    WriteBuffer: [],
                };

                // If this is a beacon, need to create a beacon data object
                if (isBeacon) {
                    state.BeaconData[peripheralID] = [];
                }
            }

            // Update the device map
            
            // Get the current device map state
            let deviceMap = state.DeviceMap;
            // Check if the device is already tracked
            let isTracked = false;
            deviceMap.available.forEach(id => {
                if (!isTracked && id === peripheralID) {
                    isTracked = true;
                }
            });
            // Check if in connected if not already found
            if (!isTracked) {
                deviceMap.connected.forEach(id => {
                    if (!isTracked && id === peripheralID) {
                        isTracked = true;
                    }
                });
            }
            // Check if this is a beacon
            if (!isTracked) {
                deviceMap.beacons.forEach(id => {
                    if (!isTracked && id === peripheralID) {
                        isTracked = true;
                    }
                });
            }
            // Check in the connecting section if not found in avaiable
            if (!isTracked) {
                deviceMap.connecting.forEach(id => {
                    if (!isTracked && id === peripheralID) {
                        isTracked = true;
                    }
                });
            }

            // If not is already tracked, add to the proper list
            if (!isTracked) {
                //console.log('Tracking new device: ', !hasServiceUUID, !isBeacon, !peripheralID);

                if (isBeacon) {
                    state.DeviceMap.beacons.push(peripheralID);
                } else {
                    // If not already tracked, add the peripheralID to the avaiable list
                    state.DeviceMap.available.push(peripheralID);
                }
            }

            // If this is a beacon, need to parse data
            if (isBeacon) {
                // Get the previous data
                let prevData = state.BeaconData[peripheralID];
                // Get the current data
                let curData = action.payload.advertising.manufacturerData.bytes;

                // The data should only be parsed if the message has enough bytes and does not match the previously received data
                if (curData.length >= 31 && !arraysAreEqual(prevData, curData)) {

                    //console.log('Received new beacon data for ', peripheralID);
                    
                    // Get the beacon device type string
                    let deviceType = deviceTypeToString(curData[10]);

                    // Bytes that make up the serial number:
                    BinaryParser.bytesToShort(curData[12], curData[11], (res) => {

                        // Get the device def object for the current device
                        let deviceDef = store.getState().deviceManager.DeviceDefs[peripheralID];

                        //console.log(peripheralID, ' - ', res);
                        //console.log(store.getState().deviceManager.DeviceDefs[peripheralID]);
                        // Set the device serial number
                        if (deviceDef.serialNum != res) {
                            deviceDef.serialNum = res;
                        }

                        // Build the sid for the device
                        let nName = deviceType + '-' + res;
                        // Check if the 
                        if (nName !== deviceDef.name) {
                            deviceDef.name = nName;
                        }

                        // Update the store with the new device def
                        store.getState().deviceManager.DeviceDefs[peripheralID] = deviceDef;
                    });

                    // Bytes that make up the value
                    let valueBytes = [curData[18], curData[17], curData[16], curData[15]];
                    BinaryParser.bytesToFloat(curData[18], curData[17], curData[16], curData[15], (res) => {

                        let specieName = markerToValueName(String.fromCharCode(curData[14]));

                        //console.log('Value: ', specieName, ' = ', res);

                        // Get the device data object to update
                        let deviceData = store.getState().deviceManager.DeviceData[peripheralID];

                        // Add specie to header if not already included

                        // Check if a header already exits
                        if (deviceData.header) {
                            // Check if the specie name is in the existing header
                            if (!deviceData.header.includes(specieName)) {
                                // Specie name is not in header, add to header
                                deviceData.header += ',' + specieName;
                            }
                        } else {
                            // Header does not already exist, set header equal to specie name
                            deviceData.header = specieName;
                        }

                        let Species = {
                            ...deviceData.Species,
                        };

                        //console.log('Device data: ', deviceData);
                        //console.log('Specie obj: ', Species);
                        //console.log(specieName);

                        // Check if the specie already exists for the current device
                        if (!Species[specieName]) {
                            //console.log('Making specie data object');
                            Species[specieName] = {
                                species: {
                                    name: specieName,
                                    units: '', // To-Do
                                },
                                curValue: 0.0,
                                history: [],
                                values: [],
                                summary: {
                                    min: 0,
                                    max: 0,
                                    mean: 0,
                                    median: 0,
                                },
                                graph: {
                                    minX: Date.now() - 500,
                                    maxX: Date.now(),
                                },
                                numPackets: 0,
                                graphValues: [],
                            };

                            //console.log('Created specie object: ff');
                            //console.log(Object.keys(Species));
                            //console.log(Object.values(Species));
                            //console.log(Species[specieName]);
                        }

                        //console.log(!Species[specieName]);

                        // Add the new reading to the device data object

                        // Set the current value
                        Species[specieName].curValue = res;

                        let point = {
                            value: res,
                            dateTime: Date.now(),
                            packetNum: Species[specieName].numPackets,
                            units: Species[specieName].units,
                        };
                        Species[specieName].numPackets += 1;
                        // Push the new value to history
                        Species[specieName].history = [...Species[specieName].history, point].slice(-30);

                        // Update graph bounds
                        Species[specieName].graph.minX = Species[specieName].history[0].dateTime;
                        Species[specieName].graph.maxX = Species[specieName].history[Species[specieName].history.length - 1].dateTime;

                        if (Species[specieName].history.length == 1) {
                            Species[specieName].graph.minX = Date.now() - 250;
                            Species[specieName].graph.maxX = Date.now() + 250;
                        }

                        // Create graph object
                        let graphPoint = {
                            x: Date.now(),
                            y: res,
                        };

                        // Add new data point to graph data
                        Species[specieName].graphValues = [...Species[specieName].graphValues, graphPoint].slice(-30);

                        // Create a new summary based on the new data
                        Species[specieName].summary = createSummary(Species[specieName].history);

                        //console.log(Species);

                        // Update the data specie object
                        deviceData.Species = Species;

                        //console.log('Final state: ', deviceData);

                        // Update the state value with the updated device data object
                        store.getState().deviceManager.DeviceData[peripheralID] = deviceData;
                    });

                    // Update previous data array. Push to copy b/c array is empty otherwise
                    state.BeaconData[peripheralID] = [];
                    curData.forEach(c => state.BeaconData[peripheralID].push(c));
                }
            }
        },

        // This is triggered when the app should start connecting to a device
        startConnect(state, action) {
            //console.log('Start connect');

            // Get state object to update
            let deviceMap = state.DeviceMap;

            // If the payload(peripheralID) is correct, move the device to the connecting list
            if (action.payload != undefined) {
                // Remove the chosen device from the available list
                deviceMap.available = deviceMap.available.filter(peripheralID => peripheralID != action.payload);
                // Add the chosen device to the connecting array
                deviceMap.connecting.push(action.payload);
                // Update the actual state object
                state.DeviceMap = deviceMap;
            }
        },
        // Triggered when a device finishes connection to the app
        finishConnect(state, action) {
            // Get state object to update
            let deviceMap = state.DeviceMap;

            // console.log('Finish connect-----------------------------');
            // console.log('Action: ', action);

            // Make sure the payload(peripheralID) is valid
            if (action.payload != undefined) {
                // Remove the chosen device from the connecting list
                deviceMap.connecting = deviceMap.connecting.filter(peripheralID => peripheralID != action.payload);
                // Add the newly connected device to the connected array
                deviceMap.connected.push(action.payload);
                // Update the actual state object
                state.DeviceMap = deviceMap;

                //console.log('Finished connecting');
            } else {
                console.log('Finish connect received undefined payload');
            }
        },
        // Triggered when a user wants to disconnect from a device
        removeDevice(state, action) {
            //console.log('Remove device');

            //console.log('In remove device with: ', action);

            // Get state object to update
            let deviceMap = state.DeviceMap;
            // Remove the chosen device from the connected list
            deviceMap.connected = deviceMap.connected.filter(peripheralID => peripheralID != action.payload);
            // Remove the chosen device from the connecting list
            deviceMap.connecting = deviceMap.connecting.filter(peripheralID => peripheralID != action.payload);
            // Remove the device def
            delete state.DeviceDefs[action.payload];
            // Update the actual state object
            state.DeviceMap = deviceMap;
        },

        // Triggered when a beacon is connected
        finishBeaconConnect(state, action) {
            //console.log('Finish beacon connect');

            // Get state object to update
            let deviceMap = state.DeviceMap;

            // Verify that the peripheral id is valid
            if (action.payload != undefined) {
                // Remove the beacon id from the available list
                deviceMap.available.filter(peripheralID => peripheralID != action.payload);
                // Push device to the connected list
                deviceMap.connected.push(action.payload);
                // Update the actual state object
                state.DeviceMap = deviceMap;
            }
        },

        // Triggered when a device finishes reading in data
        readFromDevice(state, action) {
            // Get the read buffer for the device

            // console.log('Read from device----------------------------------------');
            // console.log('Keys: ', Object.keys(action.payload));
            // console.log('ID: ', action.payload.peripheralID);
            // console.log('Buffer: ', state.BluetoothData[action.payload.peripheralID].ReadBuffer);
            // console.log('Read: ', action.payload.message);

            let readBuffer = state.BluetoothData[action.payload.peripheralID].ReadBuffer;

            // Iterate over each character in the received list
            // 1. Add char to read buffer
            // 2. Check if the current message is complete
            Array.from(action.payload.message).forEach(chr => {
                // 1. Add char to read buffer
                readBuffer += chr;

                // 2. Check if the current message is complete
                if (readBuffer.substring(readBuffer.length - 3, readBuffer.length) == 'end') {
                    readBuffer = readBuffer.substring(0, readBuffer.length - 3);

                    //console.log('Parsing: ', readBuffer);

                    try {
                        // Parse the received string into an object
                        let messageJson = JSON.parse(readBuffer);
                        // Parse the received json object
                        parseMessage(messageJson, action.payload.peripheralID, state);
                    } catch (err) {
                        // Log the error
                        if (err instanceof SyntaxError) {
                            console.log("Failed to parse message json: ", err);
                            console.log(readBuffer);

                            // // Request settings when a message is failed. 99/100 times 
                            // // the failed message was the settings message. ToDo, find
                            // // better way to determine message type
                            // //this.writeToDevice(`{"command": 102, "body": []}`);
                            // dispatchEvent(this.writeToDevice())
                        } else {
                            console.log("Encountered error when parsing message json: ", err);
                        }
                    }
                    // Clear read buffer
                    readBuffer = "";
                }
            });
            // Update the state read buffer
            state.BluetoothData[action.payload.peripheralID].ReadBuffer = readBuffer;
        },
        // Clears the device read buffer for the given device
        clearReadBuffer(state, action) {
            state.BluetoothData[action.peripheralID].ReadBuffer = [];
        },
        // Triggered when a message needs to be written to a device
        writeToDevice(state, action) {
            state.BluetoothData[action.peripheralID].WriteBuffer.push(action.message);
        },
        // Used to clear the write buffer for the given device
        clearWriteBuffer(state, action) {
            state.BluetoothData[action.peripheralID].WriteBuffer = [];
        },

        // Used to clear the list of available devices when starting a bluetooth scan
        clearAvailableDevices(state, action) {
            state.DeviceMap.available = [];
        }
    }
});

export const {
    discoveredDevice,
    startConnect,
    finishConnect,
    finishBeaconConnect,
    removeDevice,
    readFromDevice,
    clearReadBuffer,
    clearWriteBuffer,
    clearAvailableDevices,
} = DeviceManagerReucer.actions;

export default DeviceManagerReucer.reducer;
