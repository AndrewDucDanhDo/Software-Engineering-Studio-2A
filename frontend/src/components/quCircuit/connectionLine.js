import React, { useLayoutEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { VToPixels } from "../../helpers/domUnits";

const useStyles = makeStyles((theme) => ({
	container: {
		position: "relative",
		left: 0,
	},
	line: {
		stroke: "black",
		strokeWidth: 1.3,
	},
}));

export default function ConnectionLine(props) {
	const theme = useTheme();
	const classes = useStyles();

	function calculateCellSizeInPixels() {
		return VToPixels(theme.circuitCellSize(1))
	}

	const [cellSize, setCellSize] = useState(calculateCellSizeInPixels());

	useLayoutEffect(() => {
		function onWindowResize() {
			setCellSize(calculateCellSizeInPixels());
		}
		window.addEventListener("resize", onWindowResize);

		return () => {
			window.removeEventListener("resize", onWindowResize);
		}
	});

	let x = "50%";
	let y1 = cellSize / 2;
	let distance = props.cellDistance * cellSize;
	let y2 = distance + y1;

	return (
		<div className={classes.container} style={{top: props.direction === "up" ? -distance : 0}}>
			<svg width={cellSize} height={distance + cellSize}>
				<line x1={x} y1={y1} x2={x} y2={y2} className={classes.line}/>
			</svg>
		</div>
	);
}