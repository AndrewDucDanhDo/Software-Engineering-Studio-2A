import React, { useEffect, useRef, useState } from "react";
import Box from "@material-ui/core/Box";
import { fashion } from "../../helpers/fashion";
import StretchBox from "../common/stretchBox";
import Cell from "./cell";
import { useTheme } from "@material-ui/core";
import GatesToolbox from "./gatesToolbox";
import Paper from "@material-ui/core/Paper";

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
    const [wireAmount, setWireAmount] = useState(3);
    const [cellAmount, setCellAmount] = useState(25);
    const [circuit, setCircuit] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const circuitRef = useRef();

    function setCell(wireIndex, cellIndex, cell) {
        let newCircuit = [...circuit];
        newCircuit[wireIndex][cellIndex] = cell;
        setCircuit(newCircuit);
    }

    useEffect(() => {
        setCircuit(prev => new Array(wireAmount)
            .fill(null)
            .map(e => new Array(cellAmount))
            .concat(prev.map(e => new Array(cellAmount).concat(e))));
    }, [wireAmount, cellAmount]);

    // TODO Remove this debug piece of code.
    useEffect(() => {
        console.log(`Circuit now ==> ${JSON.stringify(circuit)}`)
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

    function findGateVertically(startWireIndex, startCellIndex, gate, increment = 1) {
        let wireIndex = startWireIndex;
        wireIndex += increment;

        while (wireIndex > 0 && wireIndex < wireAmount) {
            let cellData = circuit[wireIndex][startCellIndex];

            if (cellData.gate === gate) {
                return startWireIndex - wireIndex;
            }
            wireIndex += increment;
        }
        return 0;
    }

    function disconnectTargetsAt(cellIndex, wireIndex) {
        for (let i = 0; i < wireAmount; i++) {
            let cellData = circuit[i][cellIndex];

            if (cellData && cellData.targets.includes(wireIndex)) {
                cellData.targets.splice(cellData.targets.indexOf(wireIndex))
            }
        }
        setCircuit([...circuit]);
    }

    function cells(amount, wireIndex) {
        let wireCells = new Array(amount);

        for (let cellIndex = 0; cellIndex < amount; cellIndex++) {

            function onGateChanged(g, oldCellData) {
                console.log(`Changing gate from ${JSON.stringify(oldCellData)} to ${g}`)
                setCell(wireIndex, cellIndex, {gate: g, targets: []});

                // Check if we are setting a new gate at the cell.
                if (g) {
                    setSelectedCell({w: wireIndex, c: cellIndex})
                } else {
                    disconnectTargetsAt(cellIndex, wireIndex);
                }
            }

            function onGateClicked(event, cellData) {
                console.log(`Selecting ${JSON.stringify(cellData)} !`);
                setSelectedCell({w: wireIndex, c: cellIndex})
            }

            function onConnect(event, cellData) {
                setCell(wireIndex, cellIndex, {...cellData, targets: [...cellData.targets, selectedCell.w]});
            }

            function onDisconnect(event, cellData) {
                let targets = cellData.targets;
                let selectedTargetIndex = targets.indexOf(selectedCell.w);

                if (selectedTargetIndex !== -1) {
                    targets.splice(selectedTargetIndex, 1);
                }
                setCell(wireIndex, cellIndex, {...cellData, targets: targets});
            }

            let cellData;
            if (circuit[wireIndex])
                cellData = circuit[wireIndex][cellIndex];

            let selectedCellData;
            if (selectedCell) {
                selectedCellData = circuit[selectedCell.w][selectedCell.c];
            }

            wireCells[cellIndex] = (<Cell key={cellIndex} wireIndex={wireIndex} cellIndex={cellIndex}
                                          selectedCell={selectedCell} cellData={cellData} circuit={circuit} selectedCellData={selectedCellData}
                                          onGateClicked={onGateClicked} onGateChanged={onGateChanged}
                                          onConnect={onConnect} onDisconnect={onDisconnect}/>);
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