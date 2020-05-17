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
    let direction = props.direction || "up";
    let x2 = size / 2;
    let y2 = size / 2;

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
    }

    return (
        <svg width={size} height={size}>
            <line x1="50%" y1="50%" x2={x2} y2={y2} className={classes.line}/>
        </svg>
    );
}