import React, { useLayoutEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

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

    function convertRelativeViewToPixels(relativeValue) {
        if (relativeValue.includes("vw")) {
            let value = parseFloat(relativeValue.replace("vw", ""));
            return (window.innerWidth / 100) * value;
        } else if (relativeValue.includes("vh")) {
            let value = parseFloat(relativeValue.replace("vh", ""));
            return (window.innerWidth / 100) * value;
        }
        return 0;
    }

    function calculateCellSizeInPixels() {
        return convertRelativeViewToPixels(theme.circuitCellSize(1))
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