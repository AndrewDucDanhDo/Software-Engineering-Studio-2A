import React, { useEffect, useState } from "react";
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

    function cells(amount, wireIndex) {
        let wireCells = new Array(amount);

        for (let cellIndex = 0; cellIndex < amount; cellIndex++) {

            function onGateChanged(g) {
                setCell(wireIndex, cellIndex, {gate: g});
            }

            let cellData;
            if (circuit[wireIndex])
                cellData = circuit[wireIndex][cellIndex];

            wireCells[cellIndex] = (<Cell key={cellIndex} cellData={cellData} onGateChanged={onGateChanged}/>);
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
            <CircuitBox flexGrow={2}>
                {wires(wireAmount, cellAmount)}
            </CircuitBox>

            <ToolBox component={Paper} variant="outlined" flexGrow={1}>
                <Box m={2}>
                    <GatesToolbox/>
                </Box>
            </ToolBox>
        </StretchBox>
    );
}