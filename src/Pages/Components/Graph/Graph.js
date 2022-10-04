//import { HorizontalAxisTime, Line, Tooltip } from "./linechart/";
import { Chart } from './linechart/Chart';
//import { HorizontalAxis } from './linechart/HorizontalAxis';
import { HorizontalAxisTime } from './linechart/HorizontalAxisTime';
import { VerticalAxis } from './linechart/VerticalAxis';
import { Line } from './linechart/Line';
import { Tooltip } from './linechart/Tooltip';
import React from "react";
import { Dimensions, View, StyleSheet, Text } from "react-native";

export const SIZEY = Dimensions.get("window").width * 5 / 8;
export const SIZEX = Dimensions.get("window").width;

export const Graph = ({ deviceData, toShow }) => {
    // console.log('GraphV3------------------------------------');
    // console.log('Graph data: ', deviceData);

    // Get the bounds for the graph
    let xMin = deviceData.Species[toShow].graph.minX;
    let xMax = deviceData.Species[toShow].graph.maxX;
    let xDiff = xMax - xMin;

    if (Number.isNaN(xMin)) {
        xMin = Date.now() - 500;
        console.log('Fixing xMin @ 1');
    }
    if (Number.isNaN(xMax)) {
        xMax = Date.now() + 500;
        console.log('Fixing xMax @ 2');
    }

    // Make sure the x axis is at least 500 ms apart. Else it will look bad
    if (xDiff < 500) {
        // Increase to a min of 500 ms
        xDiff = (500 - xDiff) / 2;
    } else {
        // Place a 10% buffer on each edge of the graph
        xDiff /= 10;
    }

    if (Number.isNaN(xDiff)) {
        console.log('xDiff is Nan');
    }

    // Expand the bounds by diff
    xMin -= xDiff;
    xMax += xDiff;

    // Get the y axis bounds for the graph
    let yMin = deviceData.Species[toShow].summary.min;
    let yMax = deviceData.Species[toShow].summary.max;
    let yDiff = yMax - yMin;

    if (yDiff < 1) {
        // Increase to a min of atleast 1
        yDiff = (1 - yDiff) / 2;
    } else {
        // Add an extra 10% buffer on each edge of the graph
        yDiff /= 10;
    }
    // Apply diff
    yMin -= yDiff;
    yMax += yDiff;

    if (Number.isNaN(xMin)) {
        xMin = Date.now() - 500;
        console.log('Fixing xMin @ 3');
    }
    if (Number.isNaN(xMax)) {
        xMax = Date.now() + 500;
        console.log('Fixing xMax @ 3');
    }

    // console.log('Graph bounds: ', toShow);
    // console.log('X: ', xMin, ' ', xMax, ' ', Number.isNaN(xMin), ' ', Number.isNaN(xMax));
    // console.log('Y: ', yMin, ' ', yMax);

    return (
        <View style={{zIndex: 0, elevation: 0, backgroundColor: 'white'}}>
            <View>
                <Chart
                    style={{ height: SIZEY, width: SIZEX }}
                    xDomain={{ min: xMin, max: xMax }}
                    yDomain={{ min: yMin, max: yMax }}
                    // Creates room for axis labels
                    padding={{ left: 40, top: 10, bottom: 15, right: 30 }}
                    >
                        <VerticalAxis tickCount={5} />
                        <HorizontalAxisTime tickCount={5} />
                        <Line 
                            data={deviceData.Species[toShow].graphValues}
                            smoothing="none" 
                            theme={{ stroke: { color: 'green', width: 1 } }}
                            tooltipComponent={<Tooltip theme={{ formatter: ({y}) => {
                                if (typeof(y) == Number) {
                                    return y.toFixed(2);
                                } else {
                                    return y;
                                }
                            } }} />} 
                        />
                </Chart>
            </View>
        </View>
    )
}

export default Graph;
