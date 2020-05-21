import React, { useEffect, useRef, useState } from "react";
import Box from "@material-ui/core/Box";
import { fashion } from "../../helpers/fashion";
import StretchBox from "../common/stretchBox";
import Cell from "./cell";
import { useTheme } from "@material-ui/core";
import GatesToolbox from "./gatesToolbox";
import Paper from "@material-ui/core/Paper";
import CellLife from "./cellLife";
import CircuitInputButton from "./circuitInputButton";
import Button from "@material-ui/core/Button";
import { translateToSimulator } from "../../helpers/quantumSimulator/quantumTranslator";
import { solveQuantumCircuit } from "../../helpers/quantumSimulator/quantumSolver";
import CellData from "./cellData";

const CircuitBox = fashion(Box, (theme) => ({
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
}));

const ToolBox = fashion(Box, (theme) => ({
    backgroundColor: "#f7f7f7",
}));

export const AllowedCircuitInputs = ["0", "1"];

export default function QuCircuit(props) {
    const theme = useTheme();
    const [wireAmount, setWireAmount] = useState(3);
    const [cellAmount, setCellAmount] = useState(25);
    const [circuit, setCircuit] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [circuitInputs, setCircuitInputs] = useState(new Array(wireAmount).fill(AllowedCircuitInputs[0]));
    const circuitRef = useRef();

    function refreshCircuit() {
        setCircuit([...circuit]);
    }

    useEffect(() => {
        console.log("recreate circuit!");
        setCircuit(prevState => new Array(wireAmount)
            .fill(null)
            .map(e => new Array(cellAmount))
            .concat(prevState.map(e => new Array(cellAmount).concat(e))));
    }, [wireAmount, cellAmount]);

    useEffect(() => {
        setCircuitInputs(prevState =>
            new Array(wireAmount)
                .fill("0")
                .map((e, i) => prevState[i] ? prevState[i] : e));
    }, [wireAmount]);

    // TODO Remove this debug piece of code.
    useEffect(() => {
        console.log(`Circuit now ==> ${JSON.stringify(circuit)}`);
    }, [circuit]);

    // TODO Remove this debug piece of code.
    useEffect(() => {
        console.log(`Circuit Inputs now ==> ${JSON.stringify(circuitInputs)}`);
    }, [circuitInputs]);

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

    function cells(amount, wireIndex) {
        let wireCells = new Array(amount);

        for (let cellIndex = 0; cellIndex < amount; cellIndex++) {
            let cellLife = new CellLife(wireIndex, cellIndex, circuit, selectedCell);

            cellLife.onGateChanged = (gate) => {
                console.log(`Changing gate from ${JSON.stringify(cellLife.cellData)} to ${gate}`);
                cellLife.removeAllConnections();

                // Check if we are setting a new gate at the cell.
                if (gate) {
                    let cellData = circuit[wireIndex][cellIndex];

                    if (!cellData) {
                        circuit[wireIndex][cellIndex] = new CellData(gate);
                    } else {
                        cellData.gate = gate;
                    }

                    // Connect to selected if the cell is placed in the middle of a connection.
                    if (cellLife.shouldShowConnectionPanel() && selectedCell.hasSourcesBelow(cellLife.wireIndex)) {
                        cellLife.createConnectionToSelected();
                    }

                    // Needs to be here to have the selectedCell have an updated selectedCell.
                    cellLife.selectedCell = cellLife;
                    // Finally set current cell as selected cell.
                    setSelectedCell(cellLife);
                } else {
                    circuit[wireIndex][cellIndex] = null;
                }

                refreshCircuit();
            };

            cellLife.onGateClicked = (event) => {
                // Needs to be here to have the selectedCell have an updated selectedCell.
                cellLife.selectedCell = cellLife;
                setSelectedCell(cellLife);
            };

            cellLife.onConnect = (event) => {
                cellLife.createConnectionToSelected();

                let cellsToLook = cellLife.getDirectionTowards(selectedCell.wireIndex) === "up" ?
                    cellLife.getCellsAbove() : cellLife.getCellsBelow();

                for (let cell of cellsToLook) {
                    if (cell.samePositionAs(selectedCell)) {
                        break;
                    }

                    if (cell.gate) {
                        cell.createConnectionToSelected();
                    }
                }

                refreshCircuit();
            };

            cellLife.onDisconnect = (event) => {
                let direction = cellLife.getDirectionTowards(selectedCell.wireIndex);
                selectedCell.getSourceCells()
                    .filter(cell => (direction === "up" && cell.wireIndex >= cellLife.wireIndex)
                        || (direction === "down" && cell.wireIndex <= cellLife.wireIndex))
                    .forEach(cell => cell.removeConnectionToSelected());

                refreshCircuit();
            };

            wireCells[cellIndex] = (<Cell key={cellIndex} cellLife={cellLife}/>);
        }

        return wireCells;
    }

    function wires(wireAmount, cellAmount) {
        let wires = new Array(wireAmount);

        for (let wireIndex = 0; wireIndex < wireAmount; wireIndex++) {

            function onInputButtonClicked(event) {
                let inputIndex = AllowedCircuitInputs.indexOf(circuitInputs[wireIndex]);
                let nextIndex = (inputIndex + 1) % AllowedCircuitInputs.length;
                circuitInputs[wireIndex] = AllowedCircuitInputs[nextIndex];
                setCircuitInputs([...circuitInputs]);
            }

            wires[wireIndex] = (
                <Box display="flex" key={wireIndex}>
                    <CircuitInputButton circuitInputs={circuitInputs} wireIndex={wireIndex} onClick={onInputButtonClicked}/>
                    {cells(cellAmount, wireIndex)}
                </Box>
            );
        }

        return (<>{wires}</>);
    }

    function onEvaluateButtonClicked(event) {
        let translatedCircuit = translateToSimulator(circuit, circuitInputs);

        console.log("Got translation", JSON.stringify(translatedCircuit));

        solveQuantumCircuit(translatedCircuit)
            .then(result => console.log(JSON.stringify(result.filter(r => r.probability > 0))));
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
                <Box m={3}>
                    <Button color="primary" variant="contained" onClick={onEvaluateButtonClicked}>Evaluate</Button>
                </Box>
            </ToolBox>
        </StretchBox>
    );
}