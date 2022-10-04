const DEVICE_ID_PACKET_CONSTANT = 'Z';
const VOC_PACKET_CONSTANT = 'g';
const CARBON_MONOXIDE_PACKET_CONSTANT = 'M';
const CARBON_DIOXIDE_PACKET_CONSTANT = 'C';
const PM1_PACKET_CONSTANT = 'r';
const PM2PT5_PACKET_CONSTANT = 'R';
const PM10_PACKET_CONSTANT = 'q';
const TEMPERATURE_PACKET_CONSTANT = 't';
const TEMPERATURE_FAHRENHEIT_PACKET_CONSTANT = 'f';
const PRESSURE_PACKET_CONSTANT = 'P';
const HUMIDITY_PACKET_CONSTANT = 'h';
const SOUND_PACKET_CONSTANT = 's';
const LATITUDE_PACKET_CONSTANT = 'a';
const LONGITUDE_PACKET_CONSTANT = 'o';
const ACCURACY_PACKET_CONSTANT = 'c';
const PARTICLE_TIME_PACKET_CONSTANT = 'Y';
const OZONE_PACKET_CONSTANT = 'O';
const BATTERY_PACKET_CONSTANT = 'x';
const NO2_PACKET_CONSTANT = 'n';
const METHANE_CONSTANT = 'm';
const H2S_CONSTANT = 'H';

// This function handles performing a basic but thourough check to see if two arrays
// are equal.
export function arraysAreEqual(array1, array2) {
    // It is quick to make sure that the length of the two arrays are equa
    if (array1.length != array2.length) {
      return false;
    }
  
    // Used to track if the elements are equal
    let isEqual = true;
  
    // Iterate over each item in the array and check it against the same position
    // in array 2
    array1.forEach((val, i) => {
        // Check if elements are different. Only need to perform check if 
        // the elements are equal if all previous have been equal. A bool check
        // is much quicker than most other comparisons
        if (isEqual && val !== array2[i]) {
            // Set isEqual flag to false
            isEqual = false;
        }
    });
  
    // Return isEqual flag
    return isEqual;
}

// This function handles converting a marker to the name of the specie that it
// represents
export function markerToValueName(marker) {
    switch (marker) {
        case DEVICE_ID_PACKET_CONSTANT:
            return "Device ID";

        case VOC_PACKET_CONSTANT:
            return "VOC";

        case CARBON_MONOXIDE_PACKET_CONSTANT:
            return "CO";

        case CARBON_DIOXIDE_PACKET_CONSTANT:
            return "CO2";

        case PM1_PACKET_CONSTANT:
            return "PM1";

        case PM2PT5_PACKET_CONSTANT:
            return "PM 2.5";

        case PM10_PACKET_CONSTANT:
            return "PM 10";

        case TEMPERATURE_PACKET_CONSTANT:
            return "Temp(C)";

        case TEMPERATURE_FAHRENHEIT_PACKET_CONSTANT:
            return "Temp(F)";

        case PRESSURE_PACKET_CONSTANT:
            return "Press";

        case HUMIDITY_PACKET_CONSTANT:
            return "Humidity";

        case SOUND_PACKET_CONSTANT:
            return "Sound";

        case LATITUDE_PACKET_CONSTANT:
            return "Latitude";

        case LONGITUDE_PACKET_CONSTANT:
            return "Longitude";

        case ACCURACY_PACKET_CONSTANT:
            return "Accuracy";

        case PARTICLE_TIME_PACKET_CONSTANT:
            return "Particle Time";

        case OZONE_PACKET_CONSTANT:
            return "Ozone";

        case BATTERY_PACKET_CONSTANT:
            return "Battery";

        case NO2_PACKET_CONSTANT:
            return "NO2";

        case METHANE_CONSTANT:
            return "Methane";

        case H2S_CONSTANT:
            return "H2S";

        default:
            console.log('Received unknown beacon packet identifier: ', marker);
            return "Unknown";
    }
}

// This function converts a device type id to the string representation
export function deviceTypeToString(deviceType) {
    switch(deviceType) {
        case 1:
            return 'PAM';

        case 2:
            return 'AQLite';

        case 3:
            return 'AQ Sync';

        default:
            return 'Unknown';
    }
}

export default {arraysAreEqual, markerToValueName, deviceTypeToString, };