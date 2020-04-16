import React from "react";
import {Box} from "@material-ui/core";

export default class QuantumToolbar extends React.Component {

    render() {
        return (
            <Box id="toolbar">
                <Box class="std"></Box>
                <Box class="user"></Box>
            </Box>
        );
    }
}