import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    panel: {
        border: "solid rgba(0, 0, 0, 0.3) 0.1em",
        backgroundColor: "#f7f7f7",
        width: theme.spacing(1) * 10,
        height: theme.spacing(3),
    },
    connectionStatus: {
        fontSize: "0.7em",
    },
}));

export default function ConnectionPanel(props) {
    const classes = useStyles();

    /**
     * Apply type for autocomplete.
     * @type {./CellLife}
     */
    let cellLife = props.cellLife;

    function onButtonClicked(event) {
        let connected = cellLife.isConnected;

        if (!connected) {
            if (cellLife.onConnect) {
                cellLife.onConnect(event);
            }
        } else {
            if (cellLife.onDisconnect) {
                cellLife.onDisconnect(event);
            }
        }

    }

    return (
        <Box boxShadow={3} className={clsx(classes.panel, props.className)} px={2} py={1}
             display="flex" justifyContent="center" alignContent="center">
            <Button variant="contained" onClick={onButtonClicked} className={classes.connectionStatus}>
                {cellLife.isConnected ? "Disconnect" : "Connect"}
            </Button>
        </Box>
    );
}