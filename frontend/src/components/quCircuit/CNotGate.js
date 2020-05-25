import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
	circle: {
		fill: "white",
		stroke: "black",
		strokeWidth: 2,
	},
	line: {
		stroke: "black",
		strokeWidth: 2,
	},
});

export default function CNotGate(props) {
	const classes = useStyle();
	let size = props.size || 100;
	let radius = size / 3;

	return (
		<svg width={size} height={size}>
			<circle cx="50%" cy="50%" r={radius} className={classes.circle}/>
			<line x1={(size / 2) - radius} y1={size / 2} x2={(size / 2) + radius} y2={size / 2} className={classes.line}/>
			<line x1={size / 2} y1={(size / 2) - radius} x2={size / 2} y2={(size / 2) + radius} className={classes.line}/>
		</svg>
	);
}