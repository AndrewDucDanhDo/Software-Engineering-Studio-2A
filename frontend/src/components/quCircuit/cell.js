import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DraggableGate from "./draggableGate";

const useStyles = makeStyles((theme) => ({
    wireBox: {
        position: "relative",
        height: theme.spacing(3) * 2,
        width: theme.spacing(3) * 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
    },
    wire: {
        position: "absolute",
        borderBottom: "solid black 0.15em",
        width: theme.spacing(3) * 2,
        top: ((theme.spacing(3) * 2) / 2) - 2, // (height / 2) - borderSize
        zIndex: -1,
    },
    gateContainer: {
        position: "absolute",
    },
}));

export default function Cell(props) {
    const classes = useStyles();

    function setGateAndListeners(g) {
        if (props.onGateChanged) {
            props.onGateChanged(g);
        }
    }

    function onDraggedOver(event) {
        event.preventDefault();
        console.log("Dragging over")
    }

    function onDrop(event) {
        event.preventDefault();

        let gate = event.dataTransfer.getData("gate");
        setGateAndListeners(gate);
    }

    function onDragGateEnd(event) {
        event.preventDefault();
        setGateAndListeners(null);
    }

    function gateIcon() {
        if (!props.cellData || !props.cellData.gate) return null;

        return (
            <div className={classes.iconContainer}>
                <DraggableGate size="md" gate={props.cellData.gate} onDragEnd={onDragGateEnd} draggable/>
            </div>
        );
    }

    return (
        // Use div with makeStyles here. Apparently it's faster for performance when we are rendering hundreds of these.
        <div className={classes.wireBox} onDragOver={onDraggedOver} onDrop={onDrop}>
            <div className={classes.wire}/>
            {gateIcon()}
        </div>
    );
}