import React from "react";
import { View, Text, FlatList, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const numColumns = 2;

export const DataDisplay = ({deviceDef, deviceData, toShow}) => {

    const summary = deviceData.Species[toShow].summary;
    // console.log('Summary keys: ', Object.keys(summary));
    // console.log('Min: ', summary.min);
    // console.log('Max: ', summary.max);
    // console.log('Median: ', summary.median);
    // console.log('Mean: ', summary.mean);

    // Build data to display
    let top = [
        {
            content: "Min: " + summary.min.toFixed(2),
            key: 1,
        },
        {
            content: "Max: " + summary.max.toFixed(2),
            key: 2,
        },
    ];
    let bottom = [
        {
            content: "Mean: " + summary.mean.toFixed(2),
            key: 3,
        },
        {
            content: "Median: " + summary.median.toFixed(2),
            key: 4,
        },
    ];

    return (
        <View>
            <FlatList style={{ width: Dimensions.get("window").width }}
                horizontal
                data={top}
                renderItem={ ({ item }) => <Text style={{ color:"black", width: Dimensions.get("window").width / 2, paddingLeft: 25, borderWidth:  1 }}>{item.content}</Text> }
                listKey={item => item.key}
                />
            <FlatList
                horizontal
                data={bottom}
                renderItem={ ({ item }) => <Text style={{ color:"black", width: Dimensions.get("window").width / 2, paddingLeft: 25, borderWidth:  1 }}>{item.content}</Text> }
                listKey={item => item.key}
                />
        </View>
    );
};

export default DataDisplay;
