import React, { useContext } from "react";
//import React from "react";
import { Grid } from "@material-ui/core";
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,
    ZoomAndPan,
    Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, HoverState } from '@devexpress/dx-react-chart';
import { Animation, ValueScale } from '@devexpress/dx-react-chart';
import { CircuitResultsContext } from "../../context/circuit";

const formatResults = (results) => {
    return (
        results
            // Dont use any results where the probability is zero
            //.filter((result) => Math.floor(result.probability) > 0)
            // Format probability for each to a float
            .map((result) => {
                return {
                    state: '|' + result.state + "\u3009",
                    //probability: Math.floor(result.probability)/100,
                    probability: parseFloat(result.probability, 10)/100
                };
            })
    );
};

export default function QuantumBarChart(props) {
    const circuitResults = useContext(CircuitResultsContext);
    return (
        <Grid item flexGrow={1} flexShrink={6} style={{ backgroundColor: "#F1F1EE" }}>
            <Chart data={formatResults(circuitResults)}>
                <ValueScale name="probability" />
                <ValueAxis
                    scaleName="probability"
                    showGrid={false}
                    showTicks={true}
                    showLine={true}
                />
                <ArgumentAxis/>
                <BarSeries
                    valueField="probability"
                    argumentField="state"
                    scaleName="probability"
                />
                <EventTracker/>
                <HoverState/>
                <Tooltip />
                <ZoomAndPan />
                <Animation />
            </Chart>
        </Grid>
    );
}

