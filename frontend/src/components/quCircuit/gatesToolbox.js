import React from "react";
import Box from "@material-ui/core/Box";
import { Gates } from "../../helpers/quCircuit/gates";
import DraggableGate from "./draggableGate";
import Paper from "@material-ui/core/Paper";


export default function GatesToolbox(props) {

	return (
		<Box display="flex" flexWrap="wrap" flexDirection="row">
			{Object.values(Gates).map((g) => (
				<Box component={Paper} p={0.6} m={0.4} style={{float: "left"}} key={g}>
					<DraggableGate size="lg" gate={g}/>
				</Box>
			))}
		</Box>
	);
}