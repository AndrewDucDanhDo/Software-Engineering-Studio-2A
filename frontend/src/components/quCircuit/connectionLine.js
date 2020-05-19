import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        position: "relative",
        left: 0,
    },
    line: {
        stroke: "black",
        strokeWidth: 1,
    },
}));

export default function ConnectionLine(props) {
    const theme = useTheme();
    const classes = useStyles();

    function convertRelativeViewToPixels(relativeValue) {
        if (relativeValue.includes("vw")) {
            let value = parseInt(relativeValue.replace("vw", ""));
            return window.innerWidth / (100 / value);
        } else if (relativeValue.includes("vh")) {
            let value = parseInt(relativeValue.replace("vh", ""));
            return window.innerHeight / (100 / value);
        }
        return 0;
    }

    let x = "50%";
    let cellSize = convertRelativeViewToPixels(theme.circuitCellSize(1));
    let y1 = cellSize / 2;
    let distance = convertRelativeViewToPixels(theme.circuitCellSize(props.cellDistance || 0));
    let y2 = distance + y1;

    return (
        <div className={classes.container} style={{top: props.direction === "up" ? -distance : 0}}>
            <svg width={theme.circuitCellSize(1)} height={distance + (cellSize * 2)}>
                <line x1={x} y1={y1} x2={x} y2={y2} className={classes.line}/>
            </svg>
        </div>
    );
}