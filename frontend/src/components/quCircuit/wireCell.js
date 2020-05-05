import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import DraggableGate from "./draggableGate";

const useStyles = makeStyles((theme) => ({
    wireBox: {
        position: "relative",
        height: theme.spacing(3) * 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
    },
    wire: {
        borderBottom: "solid black 2px",
        width: theme.spacing(3) * 2,
        userSelect: "none",
    },
    iconContainer: {
        position: "absolute",
        backgroundColor: "#ffffff",
        zIndex: 1,
        userSelect: "none",
    },
}));

export default function WireCell(props) {
    const classes = useStyles();
    const [gate, setGate] = useState(null);

    function onDraggedOver(event) {
        event.preventDefault();
        console.log("Dragging over")
    }

    function onDrop(event) {
        event.preventDefault();

        let gate = event.dataTransfer.getData("gate");
        setGate(gate);
    }

    function onDragGateEnd(event) {
        event.preventDefault();
        setGate(null);
    }

    function gateIcon() {
        if (!gate) return null;

        return (
            <div className={classes.iconContainer}>
                <DraggableGate size="md" gate={gate} onDragEnd={onDragGateEnd} draggable/>
            </div>
        );
    }

    return (
        // TODO: Remove commented out, experimental code
        // <WireBox display="flex" alignItems="center" onDragOver={onDraggedOver} onDrop={onDrop}>
        //     <Wire/>
        // </WireBox>
        // <Box className={classes.wireBox} onDragOver={onDraggedOver} onDrop={onDrop}>
        //      <Box className={classes.wire}/>
        // </Box>

        // Use div with makeStyles here. Apparently it's faster for performance when we are rendering hundreds of these.
        <div className={classes.wireBox} onDragOver={onDraggedOver} onDrop={onDrop}>
            <div className={classes.wire}/>
            {gateIcon()}
        </div>
    );
}