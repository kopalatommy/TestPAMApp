import { useState } from "react"
import { View, Text, TextInput, StyleSheet } from 'react-native';
import React from "react";
//import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';

const OptionsSetting = ({setting, level, toChange, setToChange}) => {
    const leftMargin = level * 10;

    let inToChange = toChange[setting.id] != undefined;

    let curVal = setting.currentVal;
    if (inToChange) {
        curVal = toChange[setting.id].newValue;
    }

    // Determines the currently selected object
    const [value, setValue] = useState(curVal);
    // Determines whether the slected option is open
    const [isFocus, setIsFocus] = useState(false);

    // Set the items to be displayed in the menu
    let itemsToDisplay = []
    setting.items.forEach(option => {
        itemsToDisplay.push({label: option, value: option});
    });
    
    const [items, setItems] = useState(itemsToDisplay);

    const select = (item) => {
        // Update toChange dictionary with new setting
        setValue(item.value);
        setIsFocus(false);
        toChange[setting.id] = {
            id: setting.id,
            newValue: item.value,
            valueType: setting.valueType,
            isDevice: setting.isDevice
        }
        setToChange(toChange);
        //console.log("To change: ", toChange);
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
            <Text style={{fontSize:20, color: "black"}}>{setting.description}</Text>
            <View style={{width: 120}}>
                <Dropdown 
                    style={[styles.dropdown, styles.textItem, isFocus && { borderColor: 'black', color:"black" }]}
                    data={items}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? "Select item" : "..."}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => select(item)}

                    selectedTextStyle={{color: 'black'}}
                    placeholderStyle={{color: 'black'}}
                    itemTextStyle={{color: 'black'}}
                    
                    //item
                    //itemTextStyle={{color: 'black'}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    textItem: {
        color: "black"
      },
});

export default OptionsSetting;
