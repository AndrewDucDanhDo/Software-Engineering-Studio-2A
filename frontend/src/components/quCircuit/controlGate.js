import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
    circle: {
        fill: "black",
    },
});

export default function ControlGate(props) {
    const classes = useStyle();
    let size = props.size || 100;
    let radius = size / 6;

    return (
        <svg width={size} height={size}>
            <circle cx="50%" cy="50%" r={radius} className={classes.circle}/>
        </svg>
    );
}