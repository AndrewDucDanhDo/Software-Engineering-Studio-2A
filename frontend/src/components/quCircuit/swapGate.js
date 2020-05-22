import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
    line: {
        stroke: "black",
        strokeWidth: 1.5,
    },
    wireLine: {
        stroke: "black",
        strokeWidth: 2.2,
    }
});

export default function SwapGate(props) {
    const classes = useStyle();
    /**
     * Apply for type checking and autocomplete.
     * @type {CellLife}
     */
    let cellLife = props.cellLife;
    let size = props.size || 100;
    let radius = size / 3;
    let center = size / 2;

    return (
        <svg width={size} height={size}>
            <g transform={`rotate(45 ${center} ${center})`}>
                <line x1={(center) - radius} y1={center} x2={(center) + radius} y2={center} className={classes.line}/>
                <line x1={center} y1={(center) - radius} x2={center} y2={center + radius} className={classes.line}/>
            </g>
            { !cellLife ? <line x1={0} y1={center} x2={size} y2={center} className={classes.wireLine}/> : null}
        </svg>
    );
}