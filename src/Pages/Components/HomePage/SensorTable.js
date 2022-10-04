import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const SensorCell = ({sensor, style}) => {
    return (
        <View style={StyleSheet.compose(styles.sensorCell, style)}>
            <Text style={styles.sensorType}>{sensor.species.name}</Text>
            <Text style={styles.sensorReading}>{sensor.curValue.toFixed(2)} {sensor.species.units}</Text>
        </View>
    );
}

const RowView = ({sensor1, sensor2}) => {
    return (
        <View style={styles.sensorRowContainer}>
            <SensorCell sensor={sensor1} style={styles.sensorCellContainerLeft} />
            { sensor2 && <SensorCell sensor={sensor2} style={styles.sensorCellContainerRight} /> }
        </View>
    );
}

export const SensorTable = ({sensors}) => {
    const sensorTable = [];

    for (let i = 0; i < sensors.length; i += 2) {
        sensorTable.push(<RowView sensor1={sensors[i]} sensor2={sensors[i+1]} key={i} />);
    }

    return (
        <View style={styles.sensorTableContainer}>
            {sensorTable}
        </View>
    );
}

export const SensorTableBeacon = ({peripheralID}) => {
    const sensorTable = [];

    const data = useSelector(state => state.deviceManager).DeviceData[peripheralID];

    if (data == undefined) {
        return <></>
    }

    const species = data.Species || [];
    const sensors = Object.values(species);

    for (let i = 0; i < sensors.length; i += 2) {
        sensorTable.push(<RowView sensor1={sensors[i]} sensor2={sensors[i+1]} key={i} />);
    }

    return (
        <View style={styles.sensorTableContainer}>
            {sensorTable}
        </View>
    );
}

const styles = StyleSheet.create({
    sensorTableContainer:{
        marginVertical:10,
    },
    sensorRowContainer:{
        flexDirection:"row",
        width:"100%",
        borderBottomColor:"black",
        borderBottomWidth:1,
    },

    sensorCell:{
        flexDirection:"row",
        width:"50%",
        padding:5,
    },

    sensorType:{
        flexGrow:1,
        fontSize:16,
        fontWeight:"600",
        color: "black",
    },
    sensorReading:{
        fontSize:16,
        fontWeight:"600",
        color: "blue",
    },

    sensorCellContainerLeft:{
        borderRightWidth:1,
        borderRightColor:"black",
    },
    sensorCellContainerRight:{
        borderLeftWidth:0,
        borderLeftColor:"black",
    },
});

export default { SensorTable, SensorTableBeacon };