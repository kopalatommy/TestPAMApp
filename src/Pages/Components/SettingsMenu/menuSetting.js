import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';
import React from "react";
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';

import OpenSetting from "./openSetting";
import ToggleSetting from "./toggleSetting";
import OptionsSetting from "./optionsSetting";
import ValueSetting from "./valueSetting";

const MenuSetting = ({setting, level, toChange, setToChange}) => {
    const [open, setOpen] = useState(false);
    const leftMargin = level * 10;

    return (
        <View>
            <TouchableHighlight onPress={() => setOpen(!open)} activeOpacity={0.6} underlayColor="#DDDDDD" >
            <View style={{
                flexDirection: "row",
                borderBottomWidth:1,
                borderStyle:"solid",
                justifyContent: 'space-between',
                borderColor: 'gray',
                paddingBottom: 15,
                paddingTop:15,
                marginLeft: leftMargin,
                marginRight: 10
            }}>
                <Text style={{fontSize: 20, color:"black"}}>{setting.description}</Text>
                <View style={{alignSelf:"center", color:"black"}}>
                    <FontAwesomeIcon icon={open ? faAngleDown : faAngleRight} size={20} />
                </View>
            </View>
        </TouchableHighlight>
        {
            // If the menu is open, display the appropriate setting for each sub-setting
            open && setting.items.map((subSetting, ind) => {
                switch(subSetting.type) {
                    case "value":
                        return <ValueSetting key={ind} setting={subSetting} level={level+1} toChange={toChange} setToChange={setToChange} />

                    case "open":
                        return <OpenSetting key={ind} setting={subSetting} level={level+1} toChange={toChange} setToChange={setToChange} />

                    case "toggle":
                        return <ToggleSetting key={ind} setting={subSetting} level={level+1} toChange={toChange} setToChange={setToChange} />

                    case "options":
                        return <OptionsSetting key={ind} setting={subSetting} level={level+1} toChange={toChange} setToChange={setToChange} />

                    case "menu":
                        return <MenuSetting key={ind} setting={subSetting} level={level+1} toChange={toChange} setToChange={setToChange} />

                    default:
                        console.log("Unhandled sub setting type: ", subSetting.type);
                        return <div key={ind}></div>
                }
            })
        }
        </View>
    )
}

export default MenuSetting;
