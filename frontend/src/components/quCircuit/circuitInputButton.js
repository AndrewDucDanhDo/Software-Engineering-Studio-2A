import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

let useStyles = makeStyles((theme) => ({
    button: {
        fontSize: "1.8em",
        height: theme.circuitCellSize(1),
    },
}));

export default function CircuitInputButton(props) {
    const classes = useStyles();

    return (
        <Button className={clsx(classes.button, props.className)} {...props}>
            |{props.circuitInputs[props.wireIndex]}⟩
        </Button>
    )
}