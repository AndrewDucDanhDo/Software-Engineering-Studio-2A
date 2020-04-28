import React from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {hardFashion} from "../../helpers/fashion";

const RoundedButton = hardFashion(Button, {
    root: {
        backgroundColor: "#4F7CE0",
        borderRadius: 15,
        "&:hover": {
            backgroundColor: "#7290D3"
        }
    },
    label: {
        color: "white"
    }
});

export default RoundedButton;