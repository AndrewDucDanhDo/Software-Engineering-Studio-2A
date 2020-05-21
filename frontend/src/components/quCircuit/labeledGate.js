import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
    rect: {
        fill: "white",
        stroke: "black",
        strokeWidth: 4,
    },
    label: {
        dominantBaseline: "middle",
        textAnchor: "middle",
    }
});

export default function LabeledGate(props) {
    const classes = useStyle();
    let size = props.size || 100;
    let label = props.label || "G";

    let labelSize = props.labelSize || 4;
    let fontSize = (labelSize * size) / 100;

    return (
        <svg height={size} width={size}>
            <rect width={size} height={size} className={classes.rect}/>
            <text fontSize={`${fontSize}em`} x="50%" y="50%" className={classes.label}>{label}</text>
        </svg>
    );
}