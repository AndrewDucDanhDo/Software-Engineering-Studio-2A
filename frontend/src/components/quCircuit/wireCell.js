import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import gates from "./gates";

const useStyles = makeStyles((theme) => ({
    wireBox: {
        height: theme.spacing(3) * 2,
        display: "flex",
        alignItems: "center",
    },
    wire: {
        borderBottom: "solid black 2px",
        width: theme.spacing(3) * 2,
    }
}));

export default function WireCell(props) {
    const classes = useStyles();

    function onDraggedOver(event) {
        event.preventDefault();
        console.log("Dragging over")
    }

    function onDrop(event) {
        event.preventDefault();
        console.log("On drop")
        console.log(event.currentTarget);
        console.log(event.target);


        let gate = gates[event.dataTransfer.getData("gate")];

        console.log(gate);
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
        </div>
    );
}