import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DraggableGate from "./draggableGate";
import ConnectGatePanel from "./connectGatePanel";
import { GateProperties } from "./gates";

const useStyles = makeStyles((theme) => ({
    cellContainer: {
        position: "relative",
        userSelect: "none",
    },
    cell: {
        position: "relative",
        height: theme.spacing(3) * 2,
        width: theme.spacing(3) * 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    wire: {
        position: "absolute",
        borderBottom: "solid black 0.15em",
        width: theme.spacing(3) * 2,
        top: ((theme.spacing(3) * 2) / 2) - 2, // (height / 2) - borderSize
        zIndex: -1,
    },
    gateContainer: {
        position: "absolute",
    },
    greenHighlight: {
        position: "absolute",
        height: theme.spacing(3) * 2,
        width: theme.spacing(3) * 2,
        backgroundColor: "green",
        opacity: 0.5,
        zIndex: -2,
    },
    connectPanel: {
        position: "absolute",
        top: 0,
        left: theme.spacing(3) * 3,
        zIndex: 2,
    },
}));

export default function Cell(props) {
    const classes = useStyles();

    function setGateAndListeners(g) {
        if (props.onGateChanged) {
            props.onGateChanged(g, props.cellData);
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

    let hasGate = props.cellData && props.cellData.gate;
    let isSelected = props.selectedCell
        && props.selectedCell.w === props.wireIndex
        && props.selectedCell.c === props.cellIndex;
    let shouldShowConnectPanel = props.selectedCellData
        && props.selectedCell.c === props.cellIndex
        && !isSelected
        && hasGate
        && GateProperties[props.selectedCellData.gate].targets.includes(props.cellData.gate);

    function onClick(event) {
        if (props.onGateClicked && hasGate) {
            props.onGateClicked(event, props.cellData);
        }
    }

    function onPanelClicked(event) {
        let connected = props.cellData.targets.includes(props.selectedCell.w);

        if (!connected) {
            if (props.onConnect) {
                props.onConnect(event, props.cellData);
            }
        } else {
            if (props.onDisconnect) {
                props.onDisconnect(event, props.cellData);
            }
        }

    }

    function gateIcon() {
        if (!hasGate) return null;

        return (
            <div className={classes.iconContainer}>
                <DraggableGate size="md" gate={props.cellData.gate} onDragEnd={onDragGateEnd} draggable/>
            </div>
        );
    }

    return (
        // Use div with makeStyles here. Apparently it's faster for performance when we are rendering hundreds of these.
        <div className={classes.cellContainer}>
            <div className={classes.cell} onDragOver={onDraggedOver} onDrop={onDrop} onClick={onClick}>
                <div className={classes.wire}/>
                {gateIcon()}
                {hasGate && isSelected ? <div className={classes.greenHighlight}/> : null}
            </div>

            {shouldShowConnectPanel ?
                <ConnectGatePanel className={classes.connectPanel} onClick={onPanelClicked}
                                  connected={props.cellData.targets.includes(props.selectedCell.w)}/>
                : null
            }
        </div>
    );
}