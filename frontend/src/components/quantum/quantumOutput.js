import React from "react";
import {Box} from "@material-ui/core";

export default class QuantumOutput extends React.Component {

    render() {
        return (
            <Box id="amplitudes-container">
                <Box id="hide-impossible">(show all)</Box>
                <Box id="amplitudes-scrollbox">
                    <table id="amplitudes"></table>
                </Box>
            </Box>
        );
    }
}