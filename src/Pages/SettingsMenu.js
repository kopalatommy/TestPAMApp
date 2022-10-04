import React from 'react';
import { View, } from 'react-native';
import ValueSetting from './Components/SettingsMenu/valueSetting';
import OpenSetting from './Components/SettingsMenu/openSetting';
import ToggleSetting from './Components/SettingsMenu/toggleSetting';
import OptionsSetting from './Components/SettingsMenu/optionsSetting';
import MenuSetting from './Components/SettingsMenu/menuSetting';
import { Skeleton } from './Components/BaseScreen';
import { writeToDevice } from '../Services/bluetoothService';
import { store } from '../reduxLogic/stateStore';
import CustomButton from './Components/SettingsMenu/CustomButton';

// This class is incharge of displaying all settings for the device
export class SettingsMenu extends React.Component {
    constructor (props) {
        super (props);

        //console.log('Creating settings menu');

        // Bluetooth id of selected device
        const peripheralID = props.route.params.peripheralID;
        // Gets the definition object for the selected device
        const deviceDef = store.getState().deviceManager.DeviceDefs[peripheralID];
        // Get the settings object for the selected device
        let deviceSettings = store.getState().deviceManager.DeviceSettings[peripheralID];

        // Has not received settings yet
        if (deviceSettings == undefined) {
            console.log('Requesting settings');
            // Set object to empty array so that the app doesnt crash
            deviceSettings = [];
            // Request the settings from the device
            writeToDevice(peripheralID, `{"command": 101, "body": []}`);
        }

        // Set the initial state
        this.state = {
            // Track id of selected device
            peripheralID: peripheralID,
            // Track settings of the selected device
            settings: deviceSettings,
            // Track the device definition
            def: deviceDef,
            // Settings that have been changed and need to be written to device
            toChange: {},
            // UI objects
            settingsUI: [],
            // Navigation object
            navigation: props.navigation,
        }
        this.save = this.save.bind(this);
        this.setToChange = this.setToChange.bind(this);
    }

    // Write changed settings held in 'toChange' to the device
    save () {
        // Used to build json string
        let request = {
            command: 101,
            body: [],
        };

        // Add settings to message
        for (var key in this.state.toChange) {
            request.body.push(this.state.toChange[key]);
        }

        // Write changes to PAM
        writeToDevice(this.state.peripheralID, JSON.stringify(request));

        // Reset values to change context
        this.setState({
            ... this.state,
            toChange: {},
        });

        // Request settings from device to make sure changes took place
        setTimeout(function() {
            writeToDevice(this.state.peripheralID, `{"command": 101, "body": []}`);
        }, 1000);
    }

    // Add a changed setting to the state 'toChange'
    setToChange(newSetsToChange) {
        // Get a copy of the current state
        let nState = this.state;
        // Update the toChange object
        nState.toChange = newSetsToChange;
        // Update the state with the updated version
        this.setState(nState);
    }

    render() {
        console.log('Rendering settings menu');

        // Build UI components for all settings
        const AllSettings = () => {
            return (
                <View>
                    <View>
                        {
                            // Display the appropriate setting based on the type
                            // level is passed in to determine the left margin (how much the setting must be indented)
    
                            this.state.settings.map((setting, ind) => {
                                switch (setting.type) {
                                    case "value":
                                        // console.log("Value:");
                                        // console.log(setting);
                                        return <ValueSetting key={ind} setting={setting} level={1} toChange={this.state.toChange} setToChange={this.setToChange} />
    
                                    case "open":
                                        // console.log("Open:");
                                        // console.log(setting);
                                        return <OpenSetting key={ind} setting={setting} level={1} toChange={this.state.toChange} setToChange={this.setToChange} />
    
                                    case "toggle":
                                        // console.log("Toggle:");
                                        // console.log(setting);
                                        return <ToggleSetting key={ind} setting={setting} level={1} toChange={this.state.toChange} setToChange={this.setToChange} />
    
                                    case "options":
                                        // console.log("Options:");
                                        // console.log(setting);
                                        return <OptionsSetting key={ind} setting={setting} level={1} toChange={this.state.toChange} setToChange={this.setToChange} />
    
                                    case "menu":
                                        // console.log("Menu:");
                                        // console.log(setting);
                                        return <MenuSetting key={ind} setting={setting} level={1} toChange={this.state.toChange} setToChange={this.setToChange} />
    
                                    default:
                                        console.log("Unhandled setting type: ", setting.type);
                                        return <></>
                                }
                            })
                        }
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                        <CustomButton title="Save" onPress={this.save} />
                        <CustomButton title="Refresh" onPress={ () => writeToDevice(this.state.peripheralID, `{"command": 102, "body": []}`) } />
                    </View>
                </View>
            )
        }

        const screenStack = [
            {
                // Title not included
                data: [
                    <AllSettings />
                ]
            }
        ]

        return (
            <Skeleton
                screenStack={screenStack}
                nav={{
                    isHome: false,
                    pageTitle: this.state.def.name,
                    navigation: this.state.navigation,
                }}
                />
        );
    }
}

export default { SettingsMenu };