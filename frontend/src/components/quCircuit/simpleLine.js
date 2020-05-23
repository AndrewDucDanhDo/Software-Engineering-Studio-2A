import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyle = makeStyles({
    line: {
        stroke: "black",
        strokeWidth: 2,
    },
});

export default function SimpleLine(props) {
    const classes = useStyle();
    let size = props.size || 100;
    let direction = props.direction || "horizontal";
    let x2 = "50%";
    let y2 = "50%";
    let x1 = "50%";
    let y1 = "50%";

    switch (direction) {
        case "up":
            y2 = 0;
            break;
        case "down":
            y2 = size;
            break;
        case "right":
            x2 = size;
            break;
        case "left":
            x2 = 0;
            break;
        case "horizontal":
            x2 = "100%";
            x1 = 0;
            break;
        default:
            break;
    }

    return (
        <svg width={size} height={size}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} className={classes.line}/>
        </svg>
    );
}
