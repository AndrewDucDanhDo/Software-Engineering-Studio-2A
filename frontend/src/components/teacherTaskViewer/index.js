import React from "react";
import { Grid, } from "@material-ui/core";
import QuantumSimulator from "../quantum";
import TaskSettings from "./taskSettings";

export default function TeacherTaskViewer(props) {

	return (
		<Grid
			container
			style={{ position: "absolute", width: "100%", height: "90%" }}
		>
			<TaskSettings/>
			<Grid xs={10} item>
				<QuantumSimulator />
			</Grid>
		</Grid>
	);
}
