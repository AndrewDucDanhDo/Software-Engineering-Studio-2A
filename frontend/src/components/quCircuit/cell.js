import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DraggableGate from "./draggableGate";
import ConnectGatePanel from "./connectGatePanel";

const useStyles = makeStyles((theme) => ({
    cellContainer: {
        position: "relative",
        userSelect: "none",
    },
    cell: {
        position: "relative",
        height: theme.circuitCellSize(1),
        width: theme.circuitCellSize(1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    wire: {
        position: "absolute",
        borderBottom: "solid black 0.15em",
        width: theme.circuitCellSize(1),
        top: (theme.circuitCellSize(1) / 2) - 2, // (height / 2) - borderSize
        zIndex: -1,
    },
    gateContainer: {
        position: "absolute",
    },
    greenHighlight: {
        position: "absolute",
        height: theme.circuitCellSize(1),
        width: theme.circuitCellSize(1),
        backgroundColor: "green",
        opacity: 0.5,
        zIndex: -2,
    },
    connectPanel: {
        position: "absolute",
        top: 0,
        left: theme.circuitCellSize(2),
        zIndex: 2,
    },
}));

export default function Cell(props) {
    const classes = useStyles();

    /**
     * @type {./CellLife}
     */
    let cellLife = props.cellLife;

    function setGateAndListeners(g) {

        if (cellLife.onGateChanged) {
            cellLife.onGateChanged(g);
        }
    }

    function onDraggedOver(event) {
        event.preventDefault();
        console.log("Dragging over")
    }

    function onDrop(event) {
        event.preventDefault();

        let gate = event.dataTransfer.getData("gate");
        setGateAndListeners(gate);
    }

    function onDragGateEnd(event) {
        event.preventDefault();
        setGateAndListeners(null);
    }

    function onClick(event) {
        if (cellLife.onGateClicked && cellLife.hasGate) {
            cellLife.onGateClicked(event, cellLife.cellData);
        }
    }

    function onPanelClicked(event) {
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

    function gateIcon() {
        if (!cellLife.hasGate) return null;

        return (
            <div className={classes.iconContainer}>
                <DraggableGate size="md" gate={cellLife.cellData.gate} onDragEnd={onDragGateEnd} draggable/>
            </div>
        );
    }

    return (
        // Use div with makeStyles here. Apparently it's faster for performance when we are rendering hundreds of these.
        <div className={classes.cellContainer}>
            <div className={classes.cell} onDragOver={onDraggedOver} onDrop={onDrop} onClick={onClick}>
                <div className={classes.wire}/>
                {gateIcon()}
                {cellLife.hasGate && cellLife.isSelected ? <div className={classes.greenHighlight}/> : null}
            </div>

            {cellLife.shouldShowConnectionPanel ?
                <ConnectGatePanel className={classes.connectPanel} onClick={onPanelClicked}
                                  connected={cellLife.isConnected}/>
                : null
            }
        </div>
    );
}