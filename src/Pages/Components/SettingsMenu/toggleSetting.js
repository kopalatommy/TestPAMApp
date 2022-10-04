import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';

const ToggleSetting = ({setting, level, toChange, setToChange}) => {
    
    let inToChange = toChange[setting.id] != undefined;

    let curVal = setting.currentVal;
    if (inToChange) {
        curVal = toChange[setting.id].newValue;
    }

    // Determines the state of the toggle (on/off)
    const [isEnabled, setIsEnabled] = useState(curVal);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);

        // Update the toChange dictionary with the new setting
        toChange[setting.id] = {
            id: setting.id,
            newValue: !isEnabled,
            valueType: "bool",
            isDevice: setting.isDevice
        }
        if (setting.isDevice) {
            toChange[setting.id]["deviceName"] = setting.deviceName;
        }
        setToChange(toChange);
        //console.log("To Change: " + toChange);
    }
    
    const leftMargin = level * 10;
    return (
        <View style={{
            flexDirection: "row",
            borderBottomWidth:1,
            borderStyle:"solid",
            borderColor: 'gray',
            justifyContent: 'space-between',
            paddingBottom: 12,
            paddingTop: 12,
            marginLeft: leftMargin,
            alignItems: 'center',
            marginRight: 10
        }}>
            <Text style={{fontSize:20, color: "black"}}>{setting.description}</Text>
            <Switch style={{color: "black"}} onValueChange={toggleSwitch} value={isEnabled} />
        </View>
    )
}

export default ToggleSetting;
