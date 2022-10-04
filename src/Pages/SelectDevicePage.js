import { useDispatch, useSelector } from "react-redux";
import { removeDevice } from "../reduxLogic/deviceManagerReducer";
import { connectDevice, disconnectDevices } from "../reduxLogic/middleware/bluetoothMiddleware";
import { startConnect } from "../reduxLogic/deviceManagerReducer";
import { Skeleton } from "./Components/BaseScreen";
import { DeviceSelect } from "./Components/SelectDevices/SelectDeviceWidget";

// This page is used to list the devices that are available for the user
// to connect to
export const SelectDevicePage = ({navigation}) => {
    // Get device lists
    const { connected, connecting, available } = useSelector(state => state.deviceManager).DeviceMap;
    // Get device definition objects
    const deviceDefs = useSelector(state => state.deviceManager).DeviceDefs;
    // Used to send actions to change the state
    const dispatch = useDispatch();

    // console.log('Connected: ', connected);
    // console.log('Connecting: ', connecting);
    // console.log('Avaiable: ', available);
    
    // available.forEach(id => {
    //     console.log(deviceDefs[id]);
    // });

    // Handles starting all dispatches when connecting to a device
    const connectDeviceHelper = (peripheralID) => {
        dispatch(startConnect(peripheralID));
        dispatch(connectDevice(peripheralID));
    }

    // Handles starting all dispatches when disconnecting from a device
    const disconnectDeviceHelper = (peripheralID) => {
        dispatch(removeDevice(peripheralID));
        dispatch(disconnectDevices(peripheralID));
    }

    // Create an entry for each connected device
    let connectedDevices = Object.values(connected).map((peripheralID, index) => {
        // Get the device definition object for the current device
        const def = deviceDefs[peripheralID];

        // If it does not exist, return an undefined object
        if (def == undefined) {
            return undefined;
        }

        // Return an object with the data necessary to display the device
        return {
            title: def.name,
            id: peripheralID,
            isConnected: true,
            deviceAction: () => {
                disconnectDeviceHelper(peripheralID);
            },
        };
    }).filter(val => val != undefined);

    // Create an entry for each connecting device
    let connectingDevices = Object.values(connecting).map((peripheralID, index) => {
        // Get the device definition object for the current device
        const def = deviceDefs[peripheralID];

        // If it does not exist, return an undefined object
        if (def == undefined) {
            return undefined;
        }

        // Return an object with the data necessary to display the device
        return {
            title: def.name,
            id: peripheralID,
            isConnected: true,
            deviceAction: () => {
                disconnectDeviceHelper(peripheralID);
            },
        };
    }).filter(val => val != undefined);

    // Create an entry for each available device
    let avaiableDevices = Object.values(available).map((peripheralID, index) => {
        // Get the device definition object for the current device
        const def = deviceDefs[peripheralID];

        //console.log('Def: ', def);

        // If it does not exist, return an undefined object
        if (def == undefined) {
            return undefined;
        }

        // Return an object with the data necessary to display the device
        return {
            title: def.name,
            id: peripheralID,
            isConnected: false,
            deviceAction: () => {
                connectDeviceHelper(peripheralID);
            },
        };
    }).filter(val => val != undefined);

    // Aggregate the page objects
    const deviceSections = [
        {
            title: 'Paired',
            data: connectedDevices,
        },
        {
            title: 'Pairing',
            data: connectingDevices,
        },
        {
            title: 'Pairable',
            data: avaiableDevices,
        },
    ];

    const screenStack = [
        {
            // Title not included
            data: [<DeviceSelect deviceSections={deviceSections} />]
        }
    ];

    return (
        <Skeleton
            screenStack={screenStack}
            nav={{
                isHome: false,
                pageTitle: 'Select Devices',
                navigation: navigation,
            }}
            />
    );
}

export default { SelectDevicePage };