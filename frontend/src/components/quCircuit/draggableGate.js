import React from "react";
import { fashion } from "../../helpers/fashion";
import Box from "@material-ui/core/Box";
import gates from "./gates";

const GateBox = fashion(Box, (theme) => ({
    margin: theme.spacing(0)
}));

export default function DraggableGate(props) {
    let iconPath = gates.getSvgPath(props.gate);

    function onStartDrag(event) {
        event.dataTransfer.setData("gate", props.gate);
    }

    return (
        <GateBox draggable gate={props.gate} onDragStart={onStartDrag}>
            <img src={iconPath}/>
        </GateBox>
    );
}