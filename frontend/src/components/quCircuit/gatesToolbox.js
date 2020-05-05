import React from "react";
import Box from "@material-ui/core/Box";
import gates from "./gates";
import DraggableGate from "./draggableGate";


export default function GatesToolbox(props) {

    return (
        <Box display="flex" flexWrap="wrap" flexDirection="column">
            <DraggableGate gate={gates.H}/>
            <DraggableGate gate={gates.X}/>
            <DraggableGate gate={gates.Y}/>
            <DraggableGate gate={gates.Z}/>
        </Box>
    );
}