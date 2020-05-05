import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { fashion } from "../../helpers/fashion";
import StretchBox from "../common/stretchBox";
import WireCell from "./wireCell";
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
    const [wireAmount, setWireAmount] = useState();
    const [cellAmount, setCellAmount] = useState();

    function cells(amount, key) {
        let wireCells = new Array(amount);

        for (let i = 0; i < amount; i++) {
            wireCells[i] = (<WireCell key={i}/>);
        }

        return (
            <Box display="flex" key={key}>
                {wireCells}
            </Box>
        );
    }

    function wires(wireAmount, cellAmount) {
        let wires = new Array(wireAmount);

        for (let i = 0; i < wireAmount; i++) {
            wires[i] = cells(cellAmount, i);
        }

        return (<>{wires}</>);
    }

    return (
        <StretchBox display="flex">
            <CircuitBox flexGrow={2}>
                {wires(5, 25)}
            </CircuitBox>

            <ToolBox component={Paper} variant="outlined" flexGrow={1}>
                <Box m={2}>
                    <GatesToolbox/>
                </Box>
            </ToolBox>
        </StretchBox>
    );
}