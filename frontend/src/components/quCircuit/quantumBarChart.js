import React, { useContext } from "react";
import {
	ArgumentAxis, BarSeries, Chart, Tooltip, ValueAxis, ZoomAndPan,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker, HoverState, ValueScale } from "@devexpress/dx-react-chart";
import { CircuitResultsContext } from "../../context/circuit";

const formatResults = (results) => {
	return (
		results
			// Dont use any results where the probability is zero
			.filter((result) => result.probability > 0)
			.map((result) => {
				console.log(result.probability);

				return {
					state: "|" + result.state + "⟩",
					probability: result.probability,
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
