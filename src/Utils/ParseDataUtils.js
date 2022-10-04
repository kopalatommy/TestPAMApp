import moment from "moment";
import * as RNFS from 'react-native-fs';

function quickSort(points) {
    if (points.length <= 1) {
        return points;
    } else {
        let left = [];
        let right = [];
        let pivot = points.pop();
        points.forEach(val => {
            if (val.value <= pivot) {
                left.push(val);
            } else {
                right.push(val);
            }
        });
        return [].concat(quickSort(left), pivot, quickSort(right));
    }
}

export function createSummary(dataPoints) {
    //console.log('Creating summary: ', dataPoints);

    // Need to receive an array that has items
    if (dataPoints == undefined || dataPoints.length == undefined || dataPoints.length == 0) {
        return {
            min: 0,
            max: 0,
            mean: 0,
            median: 0,
        };
    } else {
        let min = Number(dataPoints[0].value);
        let max = Number(dataPoints[0].value);
        let mean = 0;

        dataPoints.forEach(point => {
            let val = Number(point.value);

            if (val < min) {
                min = val;
            }
            if (val > max) {
                max = val;
            }
            mean += val;
        });

        let sorted = quickSort([...dataPoints]);
        let len = dataPoints.length;
        mean /= len;

        let median = sorted[parseInt(len / 2)].value;

        return {
            min: min,
            max: max,
            mean: mean,
            median: median,
        };
    }
}

const parseSettingMessage = (message, peripheralID, state) => {
    state.DeviceSettings[peripheralID] = message.body;
}

const parseMeasurements = (message, peripheralID, state) => {
    let dataLine = [];

    let deviceData = state.DeviceData[peripheralID] || {};
    let deviceDef = state.DeviceDefs[peripheralID];

    let makeHeader = deviceData.header != null;
    let header = [];

    message.body.forEach(measurement => {
        // 1. Make sure an entry exists for the value
        // 2. Parse the value into a point object
            // value
            // dataTime
            // packetNum
            // units
        // 3. Push value to history and limit size to 30
        // 4. Create summary
        // 5. Push cur value to dataline
        // 6. If making header, add value to header
        // 7. Update current value

        // Create entry for measurement if it does not exists
        if (deviceData.Species[measurement.name] == null) {
            //console.log("Creating species object for " + measurement.name);
            deviceData.Species[measurement.name] = {
                species: {
                    name: measurement.name,
                    units: measurement.units,
                },
                curValue: 0.0,
                history: [],
                values: [],
                summary: {
                    min: 0,
                    max: 10
                },
                graph: {
                    minX: Date.now() - 500,
                    maxX: Date.now(),
                },
                numPackets: 0,
                graphValues: [],
            }
        }

        let val = Number(measurement.value);
        if (Number.isNaN(val) || val == 'N/A') {
            if (deviceData.Species[measurement.name].values.length > 0) {
                val = deviceData.Species[measurement.name].values[deviceData.Species[measurement.name].values.length - 1];
            } else {
                val = 0;
            }
        }
        //console.log("Using: " + val);

        // Create point object
        const point = {
            value: val,
            dataTime: Date.now(),
            packetNum: deviceData.Species[measurement.name].numPackets,
            units: deviceData.Species[measurement.name].species.units,
        };
        deviceData.Species[measurement.name].numPackets += 1;

        const graphPoint = {
            x: Date.now(),
            y: val,
        };

        //console.log("Num data points: " + data.Species[measurement.name].history.length);
        deviceData.Species[measurement.name].history = [...deviceData.Species[measurement.name].history, point].slice(-30);
        //console.log("Num data points: " + data.Species[measurement.name].history.length);

        //console.log('Value: ' + val + " : IsNaN: " + Number.isNaN(val));

        deviceData.Species[measurement.name].values = [...deviceData.Species[measurement.name].values, val].slice(-30);

        deviceData.Species[measurement.name].graphValues = [...deviceData.Species[measurement.name].graphValues, graphPoint].slice(-30);

        // Push point object to history and limit size to -30
        //data.Species[measurement.name].history = data.Species[measurement.name].history.concat(point).slice(-30);

        // Create summary
        deviceData.Species[measurement.name].summary = createSummary(deviceData.Species[measurement.name].history);

        //console.log('Summary: ', deviceData.Species[measurement.name].summary);

        // Graph values
        deviceData.Species[measurement.name].graph = {
            minX: deviceData.Species[measurement.name].history[0].dataTime,
            maxX: deviceData.Species[measurement.name].history[deviceData.Species[measurement.name].history.length - 1].dataTime,
        };

        // Add value to data line
        dataLine.push(val);

        // Make header if necessary
        if (makeHeader) {
            header.push(measurement.name + "(" + measurement.units + ")");
        }

        // Update current value
        deviceData.Species[measurement.name].curValue = val;
    });

    if (makeHeader) {
        deviceData.header = header.join(',');
    }
    dataLine.push(message.dateTime.split(' '));
    deviceData.dataLines.push(dataLine.join(','));

    if (message.battery == 0) {
        deviceData.batteryLevel = 0;
    } else if (message.battery < 20) {
        deviceData.batteryLevel = 1;
    } else if (message.battery < 40) {
        deviceData.batteryLevel = 2;
    } else if (message.battery < 60) {
        deviceData.batteryLevel = 3;
    } else if (message.battery < 80) {
        deviceData.batteryLevel = 4;
    } else {
        deviceData.batteryLevel = 5;
    } 

    if (deviceData.readingDates == null) {
        deviceData.readingDates = [];
    }

    deviceData.readingDates = deviceData.readingDates.concat(moment(message.dateTime, "YYYY-MM-DD hh:mm:ss").toDate()).slice(-30);

    state.DeviceData[peripheralID] = deviceData;

    writeToLogFile(deviceDef.name, header, dataLine.join(','));
}

async function writeToLogFile (name, header, data) {
    let dir = RNFS.DocumentDirectoryPath + "/PAM" + name.split('-')[1];

    let dirExists = await RNFS.exists(dir);

    if (dirExists == false) {
        RNFS.mkdir(dir);
    }

    let fName = dir + "/" + "PAM_" + name.split('-')[1] + "_" + formatDate(new Date()) + ".csv";

    let exists = await RNFS.exists(fName);

    // console.log("File: " + fName);
    // console.log("File exists: " + exists);
    // console.log("Data: " + data);

    if (exists == false) {
        await RNFS.writeFile(fName, header + '\n')
            //.then(() => console.log("Wrote header"))
            .catch(() => alert("Failed to write to file"));
    }
    await RNFS.appendFile(fName, data + '\n')
        //.then(() => console.log("Wrote data"))
        .catch(() => alert("Failed to write to file"));
}

const parseFilenames = (message, peripheralID, state) => {
    console.log('Parsing file names for ', peripheralID);
    console.log('Message: ', message.body);
    console.log('Filenames: ', message.body.split('\r\n'));
}

const parseFileData = (message, peripheralID, state) => {
    console.log('Parsing file data for ', peripheralID);
    console.log('Message: ', message);
}

export const parseMessage = (message, peripheralID, state) => {
    if (peripheralID == null) {
        console.log('Trying to parse message for null device');
        return;
    }

    if (message['status'] == 200) {
        switch (message["type"]) {
        case "settings":
            parseSettingMessage(message, peripheralID, state);
            break;

        case "measurements":
            return parseMeasurements(message, peripheralID, state);

        case "confirmation":
            console.log("Handling confirmation message");
            break;

        case 'filenames':
            parseFilenames(message, peripheralID, state);
            break;

        case 'filedata':
            parseFileData(message, peripheralID, state);
            break;

        default:
            console.log("Received unhandled message type: ", message["type"]);
            break;
        }
    } else if (message["status"] == 404) {
        console.log("Message is marked as error: ", message);
    } else {
        console.log("Unknown status value: ", message["status"]);
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function formatDate(date) {
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
    ].join('_');
}

export default { createSummary, parseMessage };