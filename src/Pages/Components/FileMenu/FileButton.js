import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faShareSquare, faRemove, faDownload } from '@fortawesome/free-solid-svg-icons';

export const FileButton = ({ filename, saveCallback, deleteCallback, downloadCallback }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.filename}>{filename}</Text>
            {
                saveCallback && <TouchableOpacity style={styles.saveButton} onPress={saveCallback}>
                <FontAwesomeIcon icon={ faShareSquare } size={30} />
            </TouchableOpacity>
            }
            {
                deleteCallback && <TouchableOpacity style={styles.saveButton} onPress={deleteCallback}>
                <FontAwesomeIcon icon={ faRemove } size={30} />
            </TouchableOpacity>
            }
            {
                downloadCallback && <TouchableOpacity style={styles.saveButton} onPress={deleteCallback}>
                <FontAwesomeIcon icon={ faDownload } size={25} />
            </TouchableOpacity>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'lightgray',
        margin: 3,
        borderWidth: 1,
        borderRadius: 10,
    },
    filename: {
        flex: 1,
        color: 'black',
        textAlign: 'center',
        fontSize: 15,
        height: 30,
    },
    saveButton: {
        //flex: 1,
        justifyContent: 'center',
        width: 30,
        marginRight: 10,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: 'red',
    },

    buttonImageIcon: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    }
});

export default FileButton;