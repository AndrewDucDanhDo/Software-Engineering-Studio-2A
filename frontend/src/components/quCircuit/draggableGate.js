import React from "react";
import { fashion } from "../../helpers/fashion";
import Box from "@material-ui/core/Box";
import gates from "./gates";

const GateBox = fashion(Box, (theme) => ({
    margin: theme.spacing(0),
    userSelect: "none",
}));

export default function DraggableGate(props) {
    let iconPath = gates.getSvgPath(props.gate);

    function onDragStart(event) {
        event.dataTransfer.setData("gate", props.gate);

        if (props.onDragStart) {
            props.onDragStart(event)
        }
    }

    return (
        <GateBox draggable gate={props.gate} onDragStart={onDragStart} onDrag={props.onDrag} onDragEnd={props.onDragEnd}>
            <img className={props.imgClassName} src={iconPath}/>
        </GateBox>
    );
}