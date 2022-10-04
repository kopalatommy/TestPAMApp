import React, { useState } from "react";
import { Dimensions, Platform, SafeAreaView, StyleSheet, Text, View, ScrollView, } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
import Graph from './Components/Graph/Graph';
import DataDisplay from './Components/Graph/DataDisplay';
import { Skeleton } from './Components/BaseScreen';
import moment from "moment";

import { DeviceSelect } from "./Components/SelectDevices/SelectDeviceWidget";
import { Navbar } from "./Components/Navbar";

export const DeviceMenu = ({route, navigation}) => {
    // Get id of device to display
    const { peripheralID } = route.params;
    // Get stats object for the device
    const deviceDef = useSelector(state => state.deviceManager).DeviceDefs[peripheralID];
    // Get the data object for the device
    const deviceData = useSelector(state => state.deviceManager).DeviceData[peripheralID];

    // Dropdown state values
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(Object.keys(deviceData.Species)[0]);
    const [items, setItems] = useState(Object.keys(deviceData.Species).map(key => {
        return {
            label: key,
            value: key,
        }
    }));

    // Used to display all readings at the end of the page
    const graphData = deviceData.Species[value].graphValues.map((item, index) => {
        return (
            <Text key={index} style={styles.graphDataText}>{moment(new Date(item.x)).format('hh:mm:ss')}, {item.y.toFixed(2)}</Text>
        )
    });

    let height = Dimensions.get('window').height;

    if (Platform.OS == 'ios') {
        const screenStack = [
            {
                // Title left blank
                data: [
                    <View>
                        <DropDownPicker
                            open={isOpen}
                            setOpen={setIsOpen}
                            value={value}
                            setValue={setValue}
                            items={items}
                            setItems={setItems}

                            theme='LIGHT'
                            multiple={false}

                            mode='SIMPLE'
                            />
                        <Graph deviceData={deviceData} toShow={value} />
                        <DataDisplay deviceDef={deviceDef} deviceData={deviceData} toShow={value} />
                        <View>
                            {graphData}
                        </View>
                    </View>
                ]
            }
        ]
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.navContainer}>
                    <Navbar isHome={false} pageTitle={deviceDef.name} navigation={navigation} />
                </View>
                <View>
                    <DropDownPicker
                        open={isOpen}
                        setOpen={setIsOpen}
                        value={value}
                        setValue={setValue}
                        items={items}
                        setItems={setItems}

                        theme='LIGHT'
                        multiple={false}

                        mode='SIMPLE'
                        />
                    <Graph deviceData={deviceData} toShow={value} />
                    <DataDisplay deviceDef={deviceDef} deviceData={deviceData} toShow={value} />
                </View>
                <View>
                <Text style={{color: 'black', fontSize: 24, marginLeft: 10}}>Data Points:</Text>
                <ScrollView style={{height: height - 394}}>
                    { graphData }
                </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

// export const DeviceMenu = ({route, navigation}) => {
//     // Get id of device to display
//     const { peripheralID } = route.params;
//     // Get stats object for the device
//     const deviceDef = useSelector(state => state.deviceManager).DeviceDefs[peripheralID];
//     // Get the data object for the device
//     const deviceData = useSelector(state => state.deviceManager).DeviceData[peripheralID];

//     // Dropdown state values
//     const [isOpen, setIsOpen] = useState(false);
//     const [value, setValue] = useState(Object.keys(deviceData.Species)[0]);
//     const [items, setItems] = useState(Object.keys(deviceData.Species).map(key => {
//         return {
//             label: key,
//             value: key,
//         }
//     }));

//     // Used to display all readings at the end of the page
//     const graphData = deviceData.Species[value].graphValues.map((item, index) => {
//         return (
//             <Text key={index} style={styles.graphDataText}>{moment(new Date(item.x)).format('hh:mm:ss')}, {item.y}</Text>
//         )
//     });

//     let height = Dimensions.get('window').height;

//     // Build ios and android seperatley because android doesnt work
//     if (Platform.OS == 'ios') {
//         const screenStack = [
//             {
//                 // Leave title blank
//                 data: [
//                     <View>
//                         <DropDownPicker
//                             open={isOpen}
//                             setOpen={setIsOpen}
//                             value={value}
//                             setValue={setValue}
//                             items={items}
//                             setItems={setItems}

//                             theme='LIGHT'
//                             multiple={false}

//                             mode='SIMPLE'
//                             />
//                         <Graph deviceData={deviceData} toShow={value} />
//                         <DataDisplay deviceDef={deviceDef} deviceData={deviceData} toShow={value} />
//                     </View>
//                 ],
//             }
//         ];

//         return (
//             <Skeleton
//                 screenStack={screenStack}
//                 nav={{
//                     isHome: false,
//                     devName: deviceDef.name,
//                     navigation: navigation,
//                 }}
//                 />
//         );
//     } else {
//         //console.log('Navbar: IsHome: ', false, ' Page title: ', deviceDef.name, ' Navigation: ', navigation);
        
//         const screenStack = [
//             {
//                 // Leave title blank
//                 data: [
//                     <View>
//                         <DropDownPicker
//                             open={isOpen}
//                             setOpen={setIsOpen}
//                             value={value}
//                             setValue={setValue}
//                             items={items}
//                             setItems={setItems}

//                             theme='LIGHT'
//                             multiple={false}

//                             mode='SIMPLE'
//                             />
//                         <Graph deviceData={deviceData} toShow={value} />
//                         <DataDisplay deviceDef={deviceDef} deviceData={deviceData} toShow={value} />
//                     </View>
//                 ],
//             }
//         ];

//         return (
//             <Skeleton
//                 screenStack={screenStack}
//                 nav={{
//                     isHome: false,
//                     devName: deviceDef.name,
//                     navigation: navigation,
//                 }}
//                 />
//         );
        
//         // return (
//         //     <SafeAreaView style={styles.container}>
//         //         <View style={styles.navContainer}>
//         //             {/* <Navbar isHome={false} pageTitle={deviceDef.name} navigation={navigation} /> */}
//         //             {/* <Navbar isHome={false} pageTitle={deviceDef.name} navigation={navigation} /> */}
//         //         </View>
//         //         {/* <View>
//         //             <DropDownPicker
//         //                 open={isOpen}
//         //                 setOpen={setIsOpen}
//         //                 value={value}
//         //                 setValue={setValue}
//         //                 items={items}
//         //                 setItems={setItems}

//         //                 theme='LIGHT'
//         //                 multiple={false}

//         //                 mode='SIMPLE'
//         //                 />
//         //             <Graph deviceData={deviceData} toShow={value} />
//         //             <DataDisplay deviceDef={deviceDef} deviceData={deviceData} toShow={value} />
//         //             <View>
//         //                 <Text style={{color: 'black', fontSize: 24, marginLeft: 10}}>Data Points:</Text>
//         //                 <ScrollView style={{height: height - 394}}>
//         //                     { graphData }
//         //                 </ScrollView>
//         //             </View>
//         //         </View> */}
//         //     </SafeAreaView>
//         // );
//     }
// }

const styles = StyleSheet.create({
    graphDataText: {
        color: 'black',
        marginLeft: 20,
    },

    container: {
        flex: 1,
        marginHorizontal: 0,
        backgroundColor: 'lightblue',
    },
    navContainer: {
        backgroundColor: 'white',
        paddingTop: 5,
    },
    title: {
        fontSize: 24,
        flexGrow: 1,
        color: 'black',
    },
    titleContainer: {
        marginVertical: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
    },
});

export default {DeviceMenu};