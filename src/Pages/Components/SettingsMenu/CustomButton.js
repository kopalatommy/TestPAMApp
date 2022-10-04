import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import React from 'react';

const CustomButton = ({title, onPress}) => {
    return (
        <View style={{alignItems: "center"}}>
            <TouchableOpacity
                onPress={() => onPress()}
                style={styles.buttonContainer}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        elevation: 1,
        backgroundColor: "#89FFAA",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        margin: 10,
    },
    buttonText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        //   textTransform: "uppercase"
    }
});

export default CustomButton;