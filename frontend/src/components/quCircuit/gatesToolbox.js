import React from "react";
import Box from "@material-ui/core/Box";
import gates from "./gates";
import DraggableGate from "./draggableGate";


export default function GatesToolbox(props) {

    return (
        <Box display="flex" flexWrap="wrap" flexDirection="column">
            <DraggableGate size="lg" gate={gates.H}/>
            <DraggableGate size="lg" gate={gates.X}/>
            <DraggableGate size="lg" gate={gates.Y}/>
            <DraggableGate size="lg" gate={gates.Z}/>
        </Box>
    );
}