import { Platform, NativeModules, NativeEventEmitter, PermissionsAndroid } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';

// Constant for communicating to devices
const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const UART_RX_CHAR_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const UART_TX_CHAR_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

export const BLE_init = (store) => {
    // Create event emitter for the ble module
    const BleManagerModule = NativeModules.BleManager;
    const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

    // Permissions are handled in the main function
    //start Bluetooth
    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then((result) => {
            if (result) {
                console.log("Permission is OK");
            } else {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log("User accept");
                } else {
                    console.log("User refuse");
                }});
            }
        })
        .catch((err) => {
            console.log('Failed to get bluetooth permissions : ', err);
        })
    }

    //Start the ble manager
    BleManager.start({showAlert: false})
        .then(() => console.log('Started BleManager'))
        .catch((err) => console.log('Failed to start BleManager: ', err));
    BleManager.checkState();

    return BleManagerEmitter;
}

// Trigger the Ble manager to start searching for devices
export const listenForDevices = async (seconds) => {
    return BleManager.scan([], seconds, false);
} 

// Get a collection of all connected devices, does not include beacons
export const getConnectedDevices = async () => {
    return BleManager.getConnectedPeripherals([]);
}

// This function gets the Ble manager to connect to the given device
export const connectToDevice = async (peripheralID) => {
    // Set up a timeout timer to allow the Ble manager to connect to the device
    const connectDelay = delay => new Promise(resolve => setTimeout(resolve, delay));

    await BleManager.connect(peripheralID)
        .catch(err => console.log('Failed to connect to ', peripheralID, ': ', err))

    // Delay for 900 ms
    // ToDo, can remove this if use .then instead
    await connectDelay(900)
        .catch(err => console.log('Failed to perform connect delay: ', err));

    const peripheralData = await BleManager.retrieveServices(peripheralID, [UART_SERVICE_UUID])
        .catch(err => console.log('Failed to retreive peripheral data: ', err));

    if (Platform.OS == 'android') {
        await BleManager.requestMTU(peripheralID, 512)
            .catch(err => console.log('Failed to request MTU', err));
    }

    await BleManager.startNotification(peripheralID, UART_SERVICE_UUID, UART_TX_CHAR_UUID)
        .catch(err => console.log('Failed to start notification: ', err));
}

// Trigger the ble manager to disconnect from the given device
export const disconnectDevice = async (peripheralID) => {
    console.log('Disconnecting device: ', peripheralID);
    return BleManager.disconnect(peripheralID);
}

// This function handles sending message to the given device 
export const writeToDevice = async (peripheralID, message) => {
    // Make sure the message has the end string
    if (!message.endsWith('end')) {
        message += 'end';
    }

    return BleManager.retrieveServices(peripheralID).then(async (peripheralInfo) => {
        // convert the string to bytes
        const dataBytes = stringToBytes(message);
        // Write the message to the device
        await BleManager.write(peripheralID, UART_SERVICE_UUID, UART_RX_CHAR_UUID, dataBytes, 512)
            .catch(err => console.log('Failed to read from device: ', err));
    });
}