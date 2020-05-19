import React, { useEffect, useRef, useState } from "react";
import Box from "@material-ui/core/Box";
import { fashion } from "../../helpers/fashion";
import StretchBox from "../common/stretchBox";
import Cell from "./cell";
import { useTheme } from "@material-ui/core";
import GatesToolbox from "./gatesToolbox";
import Paper from "@material-ui/core/Paper";
import CellLife from "./cellLife";

const CircuitBox = fashion(Box, (theme) => ({
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
}));

const ToolBox = fashion(Box, (theme) => ({
    backgroundColor: "#f7f7f7",
}));

export default function QuCircuit(props) {
    const theme = useTheme();
    const [wireAmount, setWireAmount] = useState(6);
    const [cellAmount, setCellAmount] = useState(25);
    const [circuit, setCircuit] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const circuitRef = useRef();

    function refreshCircuit() {
        setCircuit([...circuit]);
    }

    useEffect(() => {
        console.log("recreate circuit!");
        setCircuit(prev => new Array(wireAmount)
            .fill(null)
            .map(e => new Array(cellAmount))
            .concat(prev.map(e => new Array(cellAmount).concat(e))));
    }, [wireAmount, cellAmount]);

    // TODO Remove this debug piece of code.
    useEffect(() => {
        console.log(`Circuit now ==> ${JSON.stringify(circuit)}`);
    }, [circuit]);

    useEffect(() => {
        function onMouseDown(event) {
            if (circuitRef.current && !circuitRef.current.contains(event.target)) {
                setSelectedCell(null);
            }
        }
        document.addEventListener("mousedown", onMouseDown);

        return () => {
            document.removeEventListener("mousedown", onMouseDown);
        }
    }, [circuitRef]);

    function disconnectTargetsAt(cellIndex, wireIndex) {
        for (let i = 0; i < wireAmount; i++) {
            let cellLife = new CellLife(wireIndex, cellIndex, circuit, selectedCell);

            if (cellLife && cellLife.hasTarget(wireIndex)) {
                cellLife.removeTarget(wireIndex);
            }
        }
        refreshCircuit();
    }

    function cells(amount, wireIndex) {
        let wireCells = new Array(amount);

        for (let cellIndex = 0; cellIndex < amount; cellIndex++) {
            let cellLife = new CellLife(wireIndex, cellIndex, circuit, selectedCell);

            cellLife.onGateChanged = (g) => {
                console.log(`Changing gate from ${JSON.stringify(cellLife.cellData)} to ${g}`);
                let cellData = circuit[wireIndex][cellIndex];

                if (!cellData) {
                    cellData = {gate: g, targets: [], controls: []};
                    circuit[wireIndex][cellIndex] = cellData
                } else {
                    cellData.gate = g;
                    cellData.targets = [];
                    cellData.controls = [];
                }

                // Check if we are setting a new gate at the cell.
                if (g) {
                    setSelectedCell(cellLife);
                } else {
                    disconnectTargetsAt(cellIndex, wireIndex);
                }

                refreshCircuit();
            };

            cellLife.onGateClicked = (event) => {
                setSelectedCell(cellLife);
            };

            cellLife.onConnect = (event) => {
                cellLife.addTarget(selectedCell.wireIndex);
                selectedCell.addControl(cellLife.wireIndex);
                refreshCircuit();
            };

            cellLife.onDisconnect = (event) => {
                if (cellLife.hasTarget(selectedCell.wireIndex)) {
                    cellLife.removeTarget(selectedCell.wireIndex);
                    selectedCell.removeControl(cellLife.wireIndex);
                    refreshCircuit();
                }
            };

            wireCells[cellIndex] = (<Cell key={cellIndex} cellLife={cellLife}/>);
        }

        return wireCells;
    }

    function wires(wireAmount, cellAmount) {
        let wires = new Array(wireAmount);

        for (let i = 0; i < wireAmount; i++) {
            wires[i] = (
                <Box display="flex" key={i}>
                    {cells(cellAmount, i)}
                </Box>
            );
        }

        return (<>{wires}</>);
    }

    return (
        <StretchBox display="flex">
            <CircuitBox flexGrow={1} flexShrink={6}>
                <div ref={circuitRef}>
                    {wires(wireAmount, cellAmount)}
                </div>
            </CircuitBox>

            <ToolBox component={Paper} variant="outlined" flexGrow={1} flexShrink={1}>
                <Box m={1}>
                    <GatesToolbox/>
                </Box>
            </ToolBox>
        </StretchBox>
    );
}