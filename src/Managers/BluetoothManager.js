import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { discoveredDevice, readFromDevice } from "../reduxLogic/deviceManagerReducer";
import { scanDevices } from "../reduxLogic/middleware/bluetoothMiddleware";
import { BLE_init } from "../Services/bluetoothService";
import { bytesToString } from 'convert-string';

// This class handles triggering the bluetooth manager to start scanning on an interval
export const BluetoothScanner = ({}) => {

    console.log('Starting bluetooth scanner');

    // Used to send events to the reducers
    const dispatch = useDispatch();

    // Start scanning for devices when the object is created
    useEffect(() => {
        dispatch(scanDevices());
    }, []);

    // // Sets a loop to trigger the device to scan for devices every 10 seconds
    // setInterval(() => {
    //     dispatch(scanDevices());
    // }, 10000);

    return (
        <></>
    )
}

export const initializeBLE = async (dispatchFunct) => {
    const bleManagerEmitter = BLE_init();

    // Handles peripherals when they are discovered
    const handleDiscoverPeripheral = (peripheral) => {
        
        // Filter out objects that are missing information
        if (!peripheral || !peripheral.id || !peripheral.name) {
            return;
        }

        // Rename id to peripheralID
        peripheral.peripheralID = peripheral.id;
        // Remove the old id value
        delete peripheral.id;

        // Send peripheral to reducer
        dispatchFunct(discoveredDevice(peripheral));
    }

    const handleScanningStop = () => {
        console.log('Stopped ble scanning');
    }

    const handleConnectPeripheral = (peripheralID, state) => {
        console.log('Finished connecting peripheral: ', peripheralID);
    }

    const handleUpdateValueForCharacteristic = ({ value, peripheral, characteristic, service }) => {

        //console.log('Reading device data: ', peripheral);

        dispatchFunct(readFromDevice({
            message: bytesToString(value),
            peripheralID: peripheral,
        }));
    }
    console.log('Set up event listeners');

    // scanning for devices
    bleManagerEmitter.addListener('BleManagerStopScan',  handleScanningStop);
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    // connecting peripheral
    bleManagerEmitter.addListener('BleManagerConnectPeripheral',  handleConnectPeripheral);
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic',  handleUpdateValueForCharacteristic);
};

export default { BluetoothScanner };