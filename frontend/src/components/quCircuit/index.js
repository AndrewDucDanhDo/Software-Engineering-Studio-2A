import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import { fashion } from "../../helpers/fashion";
import StretchBox from "../common/stretchBox";
import WireCell from "./wireCell";
import Button from "@material-ui/core/Button";
import { useTheme } from "@material-ui/core";
import GatesToolbox from "./gatesToolbox";

const CircuitBox = fashion(Box, (theme) => ({
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
}));

const RightBox = fashion(Box, (theme) => ({
    position: "absolute",
    right: 0
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
        <StretchBox>
            <CircuitBox>
                {wires(5, 25)}
            </CircuitBox>

            <Button draggable onDragStart={() => {}} test={1}>Hello</Button>

            <RightBox>
                <GatesToolbox/>
            </RightBox>
        </StretchBox>
    );
}