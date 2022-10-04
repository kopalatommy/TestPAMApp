import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from 'react';

const OpenSetting = ({setting, level, toChange, setToChange}) => {
    const leftMargin = level * 10;

    let inToChange = toChange[setting.id] != undefined;

    // Get the current value to display. Default is current setting value
    let curVal = String(setting.currentVal);
    if (inToChange) {
        // Override if value has been changed
        curVal = toChange[setting.id].newValue;
    }

    // Variable for storing the text for the text field
    const [textVal, setTextVal] = useState(curVal);

    const onChangeText = (text) => {
        setTextVal(text);
        console.log('Changed text to ', text);

        // Update the toChange dictionary with the new setting
        toChange[setting.id] =  {
            id: setting.id,
            newValue: (setting.valueType == "int") ? parseInt(text) : text,
            valueType: setting.valueType,
            isDevice: setting.isDevice
        }
        if (setting.osDevice) {
            toChange[setting.id]["deviceName"] = setting.deviceName;
        }
        setToChange(toChange);
        //console.log("Setting to change: ", toChange);
    }

    return (
        <View style={{
            flexDirection: "row",
            borderBottomWidth:1,
            borderStyle:"solid",
            borderColor: 'gray',
            justifyContent: 'space-between',
            paddingBottom: 12,
            paddingTop:12,
            alignItems: 'center',
            marginLeft: leftMargin,
            marginRight: 10
        }}>
            <Text style={{fontSize: 20, color: "black"}}>{setting.description}</Text>
            <TextInput style={{borderWidth: 1, borderRadius: 4, height: 35, margin:0, textAlign: 'center', minWidth: 30, color:"black"}} onEndEditing={event => onChangeText(event.nativeEvent.text)} defaultValue={textVal} />
        </View>
    )
}

export default OpenSetting;
