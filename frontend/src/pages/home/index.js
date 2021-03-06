import React from "react";
import { Container, Grid, Paper, Typography } from "@material-ui/core";
import QuCircuit from "../../components/quCircuit";

function HomePage() {
	return (
		<Grid
			container
			style={{ position: "absolute", width: "100%", height: "100%" }}
		>
			<Grid
				xs={2}
				item
				component={Paper}
				style={{ backgroundColor: "#f7f7f7", padding: 8 }}
			>
				<Container>
					<Typography variant="h5" style={{ paddingTop: 10 }}>
						Welcome to the quantum simulator!
					</Typography>
					<Typography variant="body1" style={{ paddingTop: 10 }}>
						Get started by dragging one of the gates on the right hand side onto
						a wire and click the "Evaluate" button to get your results.
					</Typography>
					<Typography variant="body1" style={{ paddingTop: 10 }}>
						You can also <a href="/login">login</a> to access other features of
						the site such as assigned tasks for students and creating and
						assigning tasks for teachers.
					</Typography>
				</Container>
			</Grid>
			<Grid xs={10} item>
				<QuCircuit />
			</Grid>
		</Grid>
	);
}

export default HomePage;
