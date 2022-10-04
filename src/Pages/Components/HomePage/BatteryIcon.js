import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBattery0, faBattery2, faBattery3, faBattery4, faBattery5, faBattery } from "@fortawesome/free-solid-svg-icons";

const battery_icons = [faBattery0, faBattery, faBattery2, faBattery3, faBattery4, faBattery5];
const battery_colors = ["#FF8989","#FF8989" ,"#89B1FF"  ,"#89B1FF"  ,"#89FFAA"  ,"#89FFAA"  ]

const BatteryIcon = ({level}) => {
    if (level == undefined || level == "undefined") {
        level = 0;
    }

    if (level > 5){
        level = 5;
    } else if (level < 0) {
        level = 0;
    }

    // console.log("Icon level: " + level);
    // console.log("Is icon undefined: " + (battery_icons[level] == undefined));

    return (
        <FontAwesomeIcon
            icon={battery_icons[level]}
            color={battery_colors[level]}
            size={52}
        />
    );
};

export default BatteryIcon;