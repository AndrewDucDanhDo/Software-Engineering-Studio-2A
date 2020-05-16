import React from "react";
import Box from "@material-ui/core/Box";
import Gates from "./gates";
import DraggableGate from "./draggableGate";


export default function GatesToolbox(props) {

    return (
        <Box display="flex" flexWrap="wrap" flexDirection="column">
            <DraggableGate size="lg" gate={Gates.H}/>
            <DraggableGate size="lg" gate={Gates.X}/>
            <DraggableGate size="lg" gate={Gates.Y}/>
            <DraggableGate size="lg" gate={Gates.Z}/>
        </Box>
    );
}