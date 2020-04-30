import React from "react";
import Box from "@material-ui/core/Box";
import {fashion} from "../../helpers/fashion";

// Creates a simple box that you can put stuff in, like a submissions or tasks list.
const BoxedSpace = fashion(Box, {
    border: "solid 1px rgba(0, 0, 0, 0.4)",
    borderRadius: 15,
    // margin: props.theme.spacing(6)
});

export default BoxedSpace;