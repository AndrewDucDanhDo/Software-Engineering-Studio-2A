import React from "react";
import {Box} from "@material-ui/core";

export default class QuantumCircuit extends React.Component {

    render() {
        return (
            <Box>
                <canvas id="canvas"></canvas>
            </Box>
        );
    }
}