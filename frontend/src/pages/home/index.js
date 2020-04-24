import React from "react";
import {Link} from "react-router-dom";
import {Box, Button, Grid, Paper, Typography} from "@material-ui/core";
import QuantumSimulator from "../../components/quantum";
import pizza from "../home/pizza.jpg"
function HomePage() {
	return (
		<Grid container style={{position: "absolute", width: "100%", height: "100%"}}>
                <Grid xs={2} item component={Paper} style={{backgroundColor: "#f7f7f7"}}>
		        <img src="pizza.jpg"></img>
                </Grid>
                <Grid xs={10} item>
                    <QuantumSimulator/>
                </Grid>
        </Grid>
	);
}

export default HomePage;
