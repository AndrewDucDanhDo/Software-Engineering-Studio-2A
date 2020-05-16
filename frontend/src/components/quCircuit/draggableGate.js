import React from "react";
import { fashion } from "../../helpers/fashion";
import Box from "@material-ui/core/Box";
import Gates from "./gates";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

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
    let iconPath = Gates.getSvgPath(props.gate);

    function onDragStart(event) {
        event.dataTransfer.setData("gate", props.gate);

        if (props.onDragStart) {
            props.onDragStart(event)
        }
    }

    return (
        <GateBox draggable gate={props.gate} onDragStart={onDragStart} onDrag={props.onDrag} onDragEnd={props.onDragEnd}>
            <img className={clsx(props.imgClassName, classes.icon, {
                [classes.smIcon]: props.size === "sm",
                [classes.mdIcon]: props.size === "md",
                [classes.lgIcon]: props.size === "lg",
            })} src={iconPath}/>
        </GateBox>
    );
}