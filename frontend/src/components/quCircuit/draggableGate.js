import React from "react";
import { fashion } from "../../helpers/fashion";
import Box from "@material-ui/core/Box";
import { EmptyComponent, getGateComponentOrEmpty } from "./gates";
import { makeStyles } from "@material-ui/core/styles";

const GateBox = fashion(Box, (theme) => ({
    margin: theme.spacing(0),
    userSelect: "none",
}));

const useStyles = makeStyles((theme) => ({
    smIcon: {
        width: theme.spacing(2)
    },
    mdIcon: {
        width: theme.spacing(5)
    },
    lgIcon: {
        width: theme.spacing(3) * 2
    },
    icon: {
        userSelect: "none",
    }
}));

export default function DraggableGate(props) {
    const classes = useStyles();
    const GateIcon = getGateComponentOrEmpty(props.gate);

    function onDragStart(event) {
        event.dataTransfer.setData("gate", props.gate);

        if (props.onDragStart) {
            props.onDragStart(event)
        }
    }

    let size = props.size;

    switch (size) {
        case "sm":
            size = 15;
            break;
        case "md":
            size = 35;
            break;
        case "lg":
            size = 55;
            break;
    }

    return (
        <GateBox className={props.className} draggable gate={props.gate} onDragStart={onDragStart} onDrag={props.onDrag} onDragEnd={props.onDragEnd}>
            <GateIcon className={classes.icon} size={size}/>
        </GateBox>
    );
}