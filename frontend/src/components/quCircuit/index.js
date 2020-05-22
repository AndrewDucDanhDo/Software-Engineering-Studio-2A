import React, { useEffect, useRef, useState } from "react";
import Box from "@material-ui/core/Box";
import { fashion } from "../../helpers/fashion";
import StretchBox from "../common/stretchBox";
import Cell from "./cell";
import GatesToolbox from "./gatesToolbox";
import Paper from "@material-ui/core/Paper";
import CircuitInputButton from "./circuitInputButton";
import Button from "@material-ui/core/Button";
import { translateToQuCircuit, translateToSimulator } from "../../helpers/quantumSimulator/quantumTranslator";
import { solveQuantumCircuit } from "../../helpers/quantumSimulator/quantumSolver";
import CellLife from "../../helpers/quCircuit/cellLife";
import CellData from "../../helpers/quCircuit/cellData";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const CircuitBox = fashion(Box, (theme) => ({
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
}));

const ToolBox = fashion(Box, (theme) => ({
    backgroundColor: "#f7f7f7",
}));

const SmallBox = fashion(Box, (theme) => ({
    position: "absolute",
    width: "28pt"
}));

const PlatformBox = fashion(Box, (theme) => ({
    backgroundColor: "#EEEEEE",
    border: "solid 1px #EEEEEE",
    borderRadius: 5,
    padding: theme.spacing(2),
}));

const ResultBox = fashion(Box, (theme) => ({
    overflow: "auto",
    maxHeight: "15vh",
    maxWidth: "11vw",
}));

export const MaxWires = 8;
export const MinWires = 2;
export const AllowedCircuitInputs = ["0", "1"];

export default function QuCircuit(props) {
    const [wireCount, setWireCount] = useState(MinWires);
    const [cellCount, setCellCount] = useState(25);
    const [circuit, setCircuit] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [circuitInputs, setCircuitInputs] = useState(new Array(wireCount).fill(AllowedCircuitInputs[0]));
    const [results, setResults] = useState([]);
    const circuitRef = useRef();

    function refreshCircuit() {
        setCircuit([...circuit]);
    }

    useEffect(() => {
        console.log("recreate circuit!");
        setCircuit(prevState =>  {
            let newCircuit = new Array(wireCount)
                .fill(null)
                .map(e => new Array(cellCount));

            for (let i = 0; i < wireCount; i++) {
                if (prevState[i]) {
                    for (let j = 0; j < cellCount; j++) {
                        newCircuit[i][j] = prevState[i][j];
                    }
                }
            }
            return newCircuit;
        });
    }, [wireCount, cellCount]);

    useEffect(() => {
        setCircuitInputs(prevState =>
            new Array(wireCount)
                .fill("0")
                .map((e, i) => prevState[i] ? prevState[i] : e));
    }, [wireCount]);

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

    let listeners = {};

    listeners.onGateChanged = (cellLife, gate) => {
        let wireIndex = cellLife.wireIndex;
        let cellIndex = cellLife.cellIndex;
        console.log(`Changing gate from ${JSON.stringify(cellLife.cellData)} to ${gate}`);
        cellLife.removeMultigates();
        cellLife.removeAllConnections();

        // Check if we are setting a new gate at the cell.
        if (gate) {
            let cellData = circuit[wireIndex][cellIndex];

            if (!cellData) {
                circuit[wireIndex][cellIndex] = new CellData(wireIndex, cellIndex, gate);
            } else {
                cellData.gate = gate;
            }

            let disturbedCell = cellLife.getDisturbedCell();

            // Connect to selected if the cell is placed in the middle of a connection.
            if (disturbedCell) {
                cellLife.createConnectionTo(disturbedCell);
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

    listeners.onGateClicked = (cellLife, event) => {
        // Needs to be here to have the selectedCell have an updated selectedCell.
        cellLife.selectedCell = cellLife;
        setSelectedCell(cellLife);
    };

    listeners.onConnect = (cellLife, event) => {
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

    listeners.onDisconnect = (cellLife, event) => {
        let direction = cellLife.getDirectionTowards(selectedCell.wireIndex);
        selectedCell.getSourceCells()
            .filter(cell => (direction === "up" && cell.wireIndex >= cellLife.wireIndex)
                || (direction === "down" && cell.wireIndex <= cellLife.wireIndex))
            .forEach(cell => cell.removeConnectionToSelected());

        refreshCircuit();
    };

    listeners.onGrowMultigate = (cellLife, wireIndex) => {
        let otherCell = cellLife.copyOfPosition(wireIndex, cellLife.cellIndex);

        otherCell.removeMultigates();
        otherCell.removeAllConnections();
        circuit[wireIndex][cellLife.cellIndex] = new CellData(wireIndex, cellLife.cellIndex, cellLife.gate);

        let finalMultigates = cellLife.cellData.multigates
            .concat([otherCell.wireIndex])
            .sort();

        console.log("multigates", cellLife.multigates, otherCell.multigates, finalMultigates);
        cellLife.getMultigateCells().forEach(cell => cell.cellData.multigates = finalMultigates);
        otherCell.cellData.multigates = finalMultigates;

        refreshCircuit();
    };

    function cells(amount, wireIndex) {
        let wireCells = new Array(amount);

        for (let cellIndex = 0; cellIndex < amount; cellIndex++) {
            let cellLife = new CellLife(wireIndex, cellIndex, circuit, selectedCell, listeners);
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
            .then(res => {
                setResults(res);
                console.log(JSON.stringify(res.filter(r => r.probability > 0)))
            });
    }

    function onExport(event) {
        let translatedCircuit = translateToSimulator(circuit, circuitInputs);
        const blob = new Blob([JSON.stringify(translatedCircuit)]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workspace.json';
        a.click();
    }

    function onImport(event) {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = evt => {
            const reader = new FileReader();
            reader.onloadend = evt => {
                let rawCircuit = JSON.parse(evt.target.result);
                console.log(rawCircuit);
                let [translatedCircuit, inputs]  = translateToQuCircuit(rawCircuit, cellCount);
                setWireCount(inputs.length);
                setCircuit(translatedCircuit);
                setCircuitInputs(inputs);
            };
            reader.readAsText(evt.target.files[0]);
        };
        input.click();
    }

    function onClearCircuitClicked(event) {
        setCircuit([]);
    }

    function onDrop(event) {
        event.preventDefault();

        let wireIndex = event.dataTransfer.getData("wireIndex");
        let cellIndex = event.dataTransfer.getData("cellIndex");

        if (wireIndex && cellIndex) {
            let cellLife = new CellLife(wireIndex, cellIndex, circuit, selectedCell, listeners);

            // Need to look into a better way to do this.
            cellLife.removeCell();
            refreshCircuit();
        }
    }

    return (
        <StretchBox display="flex" onDrop={onDrop}
                    onDragOver={(event) => event.preventDefault()}>
            <CircuitBox flexGrow={1} flexShrink={6}>
                <div ref={circuitRef}>
                    {wires(wireCount, cellCount)}
                </div>
            </CircuitBox>

            <ToolBox component={Paper} variant="outlined" flexGrow={1} flexShrink={1}>
                <PlatformBox m={1} display="flex">
                    <Box m={1}>
                        <Button color="primary" variant="contained" onClick={onExport}>Export</Button>
                    </Box>

                    <Box m={1}>
                        <Button color="primary" variant="contained" onClick={onImport}>Import</Button>
                    </Box>
                </PlatformBox>

                <PlatformBox m={1}>
                    <GatesToolbox/>
                </PlatformBox>

                <PlatformBox m={1}>
                    <Box m={1}>
                        <Button color="primary" variant="contained" onClick={onEvaluateButtonClicked}>Evaluate</Button>
                    </Box>
                </PlatformBox>

                <PlatformBox m={1} display="flex" justifyContent="space-around" alignContent="end">
                    <Box m={1}>
                        <Typography>
                            Wires
                        </Typography>
                        <SmallBox >
                            <TextField type="number" value={wireCount}
                                       onChange={(event) => setWireCount(Math.max(Math.min(event.target.value, MaxWires), MinWires))}/>
                        </SmallBox>
                    </Box>

                    <Box m={1}>
                        <Button color="primary" variant="contained" onClick={onClearCircuitClicked}>Clear</Button>
                    </Box>
                </PlatformBox>

                <PlatformBox m={1}>
                    <ResultBox>
                        {results.filter(r => r.probability > 0).map((e, i) => (
                            <Box m={1} key={i}>
                                <Typography>
                                    {e.amplitude}|{e.state}⟩ {e.probability}%
                                </Typography>
                            </Box>
                        ))}
                    </ResultBox>
                </PlatformBox>
            </ToolBox>
        </StretchBox>
    );
}