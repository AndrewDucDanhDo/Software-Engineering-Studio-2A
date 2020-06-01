import React, { useContext } from "react";
import {
	ArgumentAxis,
	ValueAxis,
	Chart,
	BarSeries,
	ZoomAndPan,
	Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { EventTracker, HoverState } from "@devexpress/dx-react-chart";
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
					state: "|" + result.state + "\u3009",
					probability: parseFloat(result.probability, 10) / 100,
				};
			})
	);
};

export default function QuantumBarChart(props) {
	const circuitResults = useContext(CircuitResultsContext);
	return (
		<Chart data={formatResults(circuitResults)} height="350">
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
			<EventTracker />
			<HoverState />
			<Tooltip />
			<ZoomAndPan />
			<Animation />
		</Chart>
	);
}
