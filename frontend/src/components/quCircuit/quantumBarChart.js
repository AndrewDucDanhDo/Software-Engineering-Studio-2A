import React, { useContext } from "react";
import { Grid } from "@material-ui/core";
import {
	ArgumentAxis,
	ValueAxis,
	Chart,
	BarSeries,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, ValueScale } from "@devexpress/dx-react-chart";
import { CircuitResultsContext } from "../../context/circuit";

const formatResults = (results) => {
	return (
		results
			// Dont use any results where the probability is zero
			.filter((result) => Math.floor(result.probability) > 0)
			// Format probability for each to a float
			.map((result) => {
				return {
					state: result.state,
					probability: Math.floor(result.probability),
				};
			})
	);
};

export default function QuantumBarChart(props) {
	const circuitResults = useContext(CircuitResultsContext);
	return (
		<Grid style={{ backgroundColor: "#F1F1EE" }}>
			<Chart data={formatResults(circuitResults)}>
				<ValueScale name="probability" />
				<ValueAxis
					scaleName="probability"
					showGrid={false}
					showTicks={true}
					showLine={true}
				/>
				<ArgumentAxis />
				<BarSeries
					valueField="probability"
					argumentField="state"
					scaleName="probability"
				/>
				<Animation />
			</Chart>
		</Grid>
	);
}
