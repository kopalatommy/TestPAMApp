import { Skeleton } from "./Components/BaseScreen";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as RNFS from 'react-native-fs';
import { clearWriteBuffer } from '../reduxLogic/deviceManagerReducer';
import Share from 'react-native-share';
import FileButton from './Components/FileMenu/FileButton';

function FilePage({route, navigation}) {
    // Used to interact with the global state store
    const dispatch = useDispatch();

    // Get the peripheral id for the selected device
    const {peripheralID} = route.params;

    // Get the definition object for the selected device
    const deviceDef = useSelector(state => state.deviceManager).DeviceDefs[peripheralID];
    // Get the data objects for the selected device
    const deviceData = useSelector(state => state.deviceManager).DeviceData[peripheralID];
    // Get the list of remote files for the selected device
    const deviceFiles = useSelector(state => state.deviceManager).RemoteFiles[peripheralID];

    const [dataFiles, setDataFiles] = useState([]);
    const [fileContents, setFileContents] = useState({
                                                        fName: "",
                                                        content: [],
                                                    });

    Promise.all([RNFS.readDir(RNFS.DocumentDirectoryPath + '/PAM' + deviceDef.name.split('-')[1] + '/'), dataFiles, setDataFiles])
    .then((result) => {
        // console.log("Finished read: ", result[0].length);
        // console.log(result[0]);

        if (dataFiles.length != result[0].length) {
            // console.log("Updating data files with " + result[0].length + " : " + String(result[0]));
            setDataFiles(result[0]);
        }
    })
    .catch(err => {
        'Failed to read dir: ' + err
    });

    async function readFile(file, setFileContents) {
        //console.log("Clicked on " + file.name);
        //console.log(Object.keys(file));

        let data = await RNFS.readFile(file.path);
        //console.log(data);
        setFileContents({fName: file.name, content: data});

        //console.log("Finished setting file contents");
        //console.log(data);
    }

    async function saveFile(filename) {
        //console.log("Emailing: ");
        //console.log("file:///" + filename.path);

        const options = {
            title: '',
            url: "file:///" + filename.path,
        };

        await Share.open(options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log("Share error: ");
                console.log(err);
            });
    }

    let datalines = deviceData.dataLines.slice(-30);

    let screenStack = [
        {
            title: "Local Files",
            data: dataFiles.map((name, i) => {
                return <FileButton
                            filename={name.name}
                            key={name.name + String(i)}
                            saveCallback={() => saveFile(name)}
                            deleteCallback={() => saveFile(name)}
                            />
            })
        },
    ];

    // Add the remote file section if some are present
    if (deviceFiles) {
        screenStack.push({
            title: "Remote Files",
            data: dataFiles.map((name, i) => {
                return <FileButton
                            filename={name.name}
                            key={name.name + String(i)}
                            downloadCallback={() => saveFile(name)}
                            />
            })
        });
    }

    // Add the current data section to the screen stack
    screenStack.push({
        title: "Current Data",
        data: datalines.map((lst, i) => {
            return <Text key={i} style={{ color: "black", marginLeft: 25, marginTop: 5, }}>{String(lst)}</Text>
        })
    });

    // Trying out table to see if it will look/work better for displaying data
    let dataForTable = [];
    datalines.forEach((line) => {
        dataForTable.push(line.split(','));
    });
    // console.log('Adding File Contents View to screen stack');
    // screenStack.push({
    //     title: "Current Data",
    //     data: <Text key={123}>Test</Text>
    // });

    if (fileContents.length > 0) {
        //console.log("Adding file contents");
        screenStack.push({
            title: fileContents.name,
            data: <Text style={{ color: 'black' }}>{fileContents.data}</Text>
        })
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    return (
        <Skeleton
            screenStack={screenStack}
            nav={{
                isHome: false,
                pageTitle: 'Data Files',
                navigation: navigation,
            }}
            />
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: 'black',
        backgroundColor: 'red',
    },
});

export default FilePage;