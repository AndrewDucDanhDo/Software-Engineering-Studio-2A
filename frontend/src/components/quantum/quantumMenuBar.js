import React from "react";
import { Box } from "@material-ui/core"

export default class QuantumMenuBar extends React.Component {

    render() {
        return (
            <Box>
                <ul id="menubar" className="drop">
                    <li>
                        Workspace
                        <ul>
                            <li>
                                <a href="#" onClick="window.open(window.location)">
                                    New
                                </a>
                            </li>
                            <li>
                                <a id="importJSON" href="#">
                                    Load
                                </a>
                            </li>
                            <li>
                                <a id="exportJSON" href="#">
                                    Save
                                </a>
                            </li>
                            <li>
                                Examples
                                <ul id="examples"></ul>
                            </li>
                        </ul>
                    </li>
                    <li>
                        Circuit
                        <ul>
                            <li>
                                <a id="evaluate" href="#" title="Evaluate circuit">
                                    Evaluate
                                    <Box style={{float: "right", fontSize: "11px"}}>Enter</Box>
                                </a>
                            </li>
                            <li>
                                <a id="compile" href="#" title="Compile circuit to gate">
                                    Compile
                                    <Box style={{float: "right", fontSize: "11px"}}>Ctrl+S</Box>
                                </a>
                            </li>
                            <li>
                                <a id="exportImage" href="#">
                                    Export Image
                                </a>
                            </li>
                            <li>
                                <a id="exportMatrix" href="#">
                                    Export Matrix
                                </a>
                            </li>
                            <li id="nqubits">
                                <span>Qubits</span>
                                <ul></ul>
                            </li>
                            <li>
                                <a id="reset" href="#">
                                    Reset
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li style={{float: "right"}}>
                        <a id="about" href="#">
                            About
                        </a>
                    </li>
                </ul>
            </Box>
        );
    }
}


