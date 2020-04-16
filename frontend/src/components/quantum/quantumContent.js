import React from "react";
import QuantumToolbar from "./quantumToolbar";
import QuantumCircuit from "./quantumCircuit";
import {Box} from "@material-ui/core";

export default class QuantumContent extends React.Component {

    render() {
        return (
            <Box id="content" style={this.props.innerStyle}>
                <QuantumToolbar/>
                <QuantumCircuit/>
                <Box id="progress">
                    <Box></Box>
                </Box>
            </Box>
        );
    }
}