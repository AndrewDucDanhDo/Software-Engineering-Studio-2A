import React from "react";
import { Grid, Paper } from "@material-ui/core";
import QuCircuit from "../../components/quCircuit";

function HomePage() {
	return (
		<Grid
			container
			style={{ position: "absolute", width: "100%", height: "90%" }}
		>
			<Grid
				xs={2}
				item
				component={Paper}
				style={{ backgroundColor: "#f7f7f7" }}
			>
				<div style={{ textAlign: "center" }}>
					<h2>Advertise here!</h2>
					<a href="https://www.youtube.com/watch?v=oT3mCybbhf0" target="_blank">
						Click me for more info
					</a>
				</div>
			</Grid>
			<Grid xs={10} item>
				<QuCircuit />
			</Grid>
		</Grid>
	);
}

export default HomePage;
