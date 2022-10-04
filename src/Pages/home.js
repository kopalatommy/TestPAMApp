import React from "react";
import { Dimensions, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { pages } from "./navUtils";
import { Skeleton } from './Components/BaseScreen';
import { DeviceView, BeaconDeviceView } from './Components/HomePage/DeviceView';

// The home page is in charge of displaying all currently connected devices
export const HomePage = ({ navigation }) => {
    // Connect the page to the list of connected devices. Will update whenever the list of connected devices is changed.
    const connected = useSelector(state => state.deviceManager).DeviceMap.connected;
    const beacons = useSelector(state => state.deviceManager).DeviceMap.beacons;

    // The screen stack holds all objects that should be rendered on the page
    let screenStack = [];

    // If there are connected devices, create displays for each one
    if (connected != undefined && connected.length > 0) {
        screenStack.push({
            // Title left out
            data: [
                // Create an object for each connected device
                Object.values(connected).map((peripherlID, index) => {
                    // If the peripheral id is empty or null, will be unable to pull
                    // any information about the device
                    if (!peripherlID) {
                        return undefined;
                    } else {
                        return (
                            <DeviceView key={index} peripheralID={peripherlID} navigation={navigation} />
                        );
                    }
                })
                // Remove any undefined values
                .filter(val => val != undefined),
            ]
        });
    }

    //console.log('Beacons: ', beacons, (beacons != undefined));
    // If there are any present beacons, create displays for each one
    if (beacons != undefined && beacons.length > 0) {
        //console.log('Making beacon views');
        screenStack.push({
            // Title purposely left out
            data: [
                Object.values(beacons).map((peripheralID, index) => {
                    // If the peripheral id is empty or null, will be unable to pull
                    // any information about the device
                    if (!peripheralID) {
                        return undefined;
                    } else {
                        return (<BeaconDeviceView key={index} peripheralID={peripheralID} navigation={navigation} />);
                    }
                }).filter(val => val != undefined),
            ]
        });
    }

    // If there are no connected devices or beacons present, prompt the user to
    // connect to a nearby device
    if (screenStack.length == 0) {
        // Get the screen dimensions
        let screenWidth = Dimensions.get('window').width;
        let screenHeight = Dimensions.get('window').height - 70;

        screenStack.push({
            // No title
            data: [
                <View style={{...styles.connectPromptContainer, width: screenWidth, height: screenHeight}}>
                    { /* Used to push the object down */ }
                    <View style={{height: screenHeight * 3 / 10}} />
                    <Text style={{...styles.connectPromptText}}>
                        There are no connected devices
                    </Text>
                    <TouchableOpacity onPress={() => {
                        console.log('Navigating to: ', pages.SELECT_DEVICES_PAGE);
                        navigation.navigate(pages.SELECT_DEVICES_PAGE, {});
                        }}>
                        <Text style={{...styles.connectLinkText, width:screenWidth/2, marginLeft:screenWidth/4}}>
                            Find Devices
                        </Text>
                    </TouchableOpacity>
                </View>
            ]
        });
    }

    return (
        <Skeleton 
            screenStack={screenStack} 
            nav={{
                isHome: true,
                pageTitle: 'N/A',
                navigation: navigation,
            }} />
    );
}

const styles = StyleSheet.create({
    connectPromptContainer: {
        backgroundColor: 'lightblue',
    },
    connectPromptText: {
        textAlign: 'center',
        margin: 0,
        color: 'black',
        fontSize: 30,
    },
    connectLinkText: {
        color: 'blue',
        textAlign: 'center',
        fontSize: 20,
        textDecorationLine: 'underline',
    },
});

export default { HomePage };