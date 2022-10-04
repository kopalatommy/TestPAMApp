import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from 'react';

const ValueSetting = ({setting, level}) => {
    const leftMargin = level * 10;

    return (
        <View style={{
            flexDirection: "row",
            borderBottomWidth:1,
            borderStyle:"solid",
            borderColor: 'gray',
            justifyContent: 'space-between',
            paddingBottom: 15,
            paddingTop:15,
            marginLeft: leftMargin,
            marginRight: 10
        }}>
            <Text style={{fontSize: 20, color: "black"}}>{setting.description}</Text>
            <Text style={{fontSize: 20, color: "black"}}>{setting.currentVal}</Text>
        </View>
    )
}

export default ValueSetting;
