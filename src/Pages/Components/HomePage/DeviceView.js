import { Dimensions, FlatList, TouchableOpacity, View, Text, StyleSheet, } from "react-native";
import { useSelector } from "react-redux"
import { pages } from "../../navUtils";
import { SensorTable, SensorTableBeacon } from "./SensorTable";
import BatteryIcon from "./BatteryIcon";
import { store } from "../../../reduxLogic/stateStore";

// This class is used to display a beacon device on the home page
export const BeaconDeviceView = ({peripheralID, navigation}) => {
    // Get information about the device
    const deviceDef = useSelector(state => state.deviceManager).DeviceDefs[peripheralID];
    // Get the data for the device
    //const deviceData = useSelector(state => state.deviceManager).DeviceData[peripheralID];
    const deviceData = store.getState().deviceManager.DeviceData[peripheralID];

    // If either data object is null, than this will be unable to display all
    // necessary data
    if (!deviceDef || !deviceData) {
        return (
            <></>
        );
    }

    let bottomRow = [];
    // Only show graph button if there is data to display
    if (Object.keys(deviceData.Species).length > 0) {
        bottomRow.push({
            content: 'Graph',
            key: 3,
            onPress: () => {
                console.log('Clicked on graph button @ 1');
                navigation.navigate(pages.DEVICE_MENU, {
                    peripheralID: peripheralID,
                });
            }
        });
    }

    return (
        <View style={style.container}>
            { /* Device View Title */ }
            <View style={style.titleContainer}>
                <Text style={style.title}>
                    {deviceDef.name}
                </Text>
            </View>
            { /* Sensor Table */ }
            {/* <SensorTable sensors={Object.values(deviceData.Species)} /> */}
            <SensorTableBeacon peripheralID={peripheralID} />
            {
                bottomRow && 
                <FlatList
                    horizontal
                    data={bottomRow}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity
                                style={{alignItems: 'center', padding: 10, backgroundColor: 'lightblue', width: Dimensions.get('window').width - 90, marginLeft: 10, marginRight: 10, borderRadius: 10}}
                                onPress={item.onPress}
                                >
                                    <Text style={{color: 'black'}}>{item.content}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    listKey={item => item.key}
                    />
            }
        </View>
    );
}

// This class is used to display data about direct connect devices.
export const DeviceView = ({peripheralID, navigation}) => {
    // Get information about the device
    const deviceDef = useSelector(state => state.deviceManager).DeviceDefs[peripheralID];
    // Get the data for the device
    const deviceData = useSelector(state => state.deviceManager).DeviceData[peripheralID];

    // If either data object is null, than this will be unable to display all
    // necessary data
    if (!deviceDef || !deviceData) {
        return (
            <></>
        );
    }

    let deviceBattery = String(deviceData.batteryLevel);

    // Rows of buttons to display
    let topRow = [];
    let bottomRow = [];

    topRow.push({
        content: 'Settings',
        key: 1,
        onPress: () => {
            navigation.navigate(pages.SETTINGS_MENU, {
                peripheralID: peripheralID,
            });
        },
    });
    topRow.push({
        content: 'Data Files',
        key: 2,
        onPress: () => {
            navigation.navigate(pages.FILES_MENU, {
                peripheralID: peripheralID,
            });
        }
    });

    if (Object.keys(deviceData.Species).length > 0) {
        bottomRow.push({
            content: 'Graph',
            key: 3,
            onPress: () => {
                navigation.navigate(pages.DEVICE_MENU, {
                    peripheralID: peripheralID,
                });
            }
        })
    }

    return (
        <View style={style.container}>
            { /* Device View Title */ }
            <View style={style.titleContainer}>
                <Text style={style.title}>
                    {deviceDef.name}
                </Text>
                { deviceBattery && <BatteryIcon level={deviceBattery} /> }
            </View>
            { /* Sensor Table */ }
            <SensorTable sensors={Object.values(deviceData.Species)} />

            <FlatList
                horizontal
                data={topRow}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity
                            style={{ alignItems: 'center', padding: 10, backgroundColor: 'lightblue', width: topRow.length == 1 ? (Dimensions.get('window').width - 90) : (Dimensions.get('window').width - 110) / 2, marginLeft: 10, marginRight: 10, borderRadius: 10 }}
                            onPress={item.onPress}
                            >
                                <Text style={{color: 'black'}}>{item.content}</Text>
                        </TouchableOpacity>
                    );
                }}
                listKey={item => item.key}
                />
            {
                bottomRow && 
                <FlatList
                    horizontal
                    data={bottomRow}
                    renderItem={({item}) => {
                        return (
                            <TouchableOpacity
                                style={{ alignItems: 'center', padding: 10, backgroundColor: 'lightblue', width: Dimensions.get('window').width - 90, marginLeft: 10, marginRight: 10, borderRadius: 10, marginTop: 10, }}
                                onPress={item.onPress}
                                >
                                    <Text style={{color: 'black'}}>{item.content}</Text>
                            </TouchableOpacity>
                        );
                    }}
                    listKey={item => item.key}
                    />
            }
        </View>
    );
}

const style = StyleSheet.create({
    container:{
        flexDirection:"column",
        marginHorizontal:10,
        backgroundColor:"#EAEAEA",
        padding: 25,
        marginVertical: 10,
        borderRadius:15,
    },
    titleContainer:{
        flexDirection:"row",
    },
    title:{
        fontWeight: "700",
        fontSize: 35,
        flexGrow:1,
        color: "black",
    },

    sensorTableContainer:{
        marginVertical:10,
    },
    sensorRowContainer:{
        flexDirection:"row",
        width:"100%",
        borderBottomColor:"black",
        borderBottomWidth:1,
    },

    sensorCellContainerLeft:{
        borderRightWidth:1,
        borderRightColor:"black",
    },
    sensorCellContainerRight:{
        borderLeftWidth:0,
        borderLeftColor:"black",
    },

    sensorCell:{
        flexDirection:"row",
        width:"50%",
        padding:5,
    },

    sensorType:{
        flexGrow:1,
        fontSize:16,
        fontWeight:"600",
        color: "black",
    },
    sensorReading:{
        fontSize:16,
        fontWeight:"600",
        color: "blue",
    }
});

export default { DeviceView, BeaconDeviceView };