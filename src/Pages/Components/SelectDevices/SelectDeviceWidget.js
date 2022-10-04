import { SectionList, StyleSheet, TouchableOpacity, View, Text, } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAdd, faTimes } from "@fortawesome/free-solid-svg-icons";

const DeviceSelectButton = ({onTap, state, size}) => {
    return (
        <TouchableOpacity onPress={onTap}>
            <View style={{
                backgroundColor: state ? "#FF8989":"#89FFAA",
                borderRadius: size,
            }}>
                <FontAwesomeIcon icon={state ? faTimes : faAdd} size={size} />
            </View>
        </TouchableOpacity>
    );
}

const DeviceWidget = ({device}) => {
    return (
        <View style={styles.deviceRenderContainer}>
            <Text style={styles.deviceTitle}>{device.title}</Text>
            <DeviceSelectButton onTap={device.deviceAction} state={device.isConnected} size={42} />
        </View>
    );
}

const SectionTitle = ({title}) => {
    return (
        <Text style={styles.title}>
            {title}
        </Text>
    )
}

export const DeviceSelect = ({deviceSections}) => {    
    return (
        <View style={styles.DeviceSelectContainer}>
            <SectionList
                sections={deviceSections}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => <DeviceWidget device={item} />}
                renderSectionHeader={({section: {title}}) => <SectionTitle title={title} />}
                />
        </View>
    );
}

const styles = StyleSheet.create({
    deviceRenderContainer:{
        flexDirection:'row',
        margin:10
    },
    deviceTitle:{
        fontSize:24,
        fontWeight:"700",
        flexGrow:1,
        color: "black"
    },
    title:{
        textAlign:"left",
        fontWeight:"600",
        fontSize:30,
        color:"black"
    },
    DeviceSelectContainer:{
        padding:10
    }
});


export default { DeviceSelect };