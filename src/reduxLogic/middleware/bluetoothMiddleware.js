import { listenForDevices, connectToDevice, disconnectDevice, writeToDevice } from "../../Services/bluetoothService";
import { clearAvailableDevices, finishConnect, } from "../deviceManagerReducer";

export const bluetoothMiddleware = store => next => action => {
    switch (action.type) {
        case 'BLE_SCAN':
            console.log('BLE_SCAN');

            // Clear the list of available devices
            store.dispatch(clearAvailableDevices());
            // Start listening for new devices
            listenForDevices(10000000)
                .catch(err => console.log('Failed to start listening for devices: ', err));
            break;

        case 'BLE_CONNECT':
            console.log('Connecting to: ', action.payload);

            // Connect to the given device
            connectToDevice(action.payload)
                .then(async () => {
                    console.log('Connected to: ', action.payload);

                    // Finalize adding the device now that it is connected to the ble manager
                    store.dispatch(finishConnect(action.payload));

                    // Send message to have the device send settings
                    await writeToDevice(action.payload, `{"command": 100, "body": []}`)
                        // Send message to have device send file names
                        //.then(async () => writeToDevice(action.payload, `{"command": 102, "body": []}`))
                        .catch(err => console.log('Failed to write message to device: ', err));
                })
                .catch(err => {
                    console.log('Failed to connect to ', action.payload, ': ', err);
                    // Make sure the device is fully disconnected from the app
                    disconnectDevice(action.payload);
                });
            break;

        case 'BLE_DISCONNECT':
            disconnectDevice(action.payload)
                .then(() => {
                    console.log(action.payload, ' has disconnected');
                });
            return;

        case 'BEACON_CONNECT':
            // Create a device definition for the device
            store.dispatch(finishBeaconConnect(action.payload));
            break;

        default:
            next(action);
            break;
    }
}

export const scanDevices = () => {
    return {
        type: 'BLE_SCAN',
    }
}

export const connectDevice = (peripheralID) => {
    return {
        type: 'BLE_CONNECT',
        payload: peripheralID,
    }
}

export const disconnectDevices = (peripheralID) => {
    return {
        type: 'BLE_DISCONNECT',
        payload: peripheralID,
    }
}

export const connectBeacon = (peripheralID) => {
    return {
        type: 'BEACON_CONNECT',
        payload: peripheralID,
    }
}