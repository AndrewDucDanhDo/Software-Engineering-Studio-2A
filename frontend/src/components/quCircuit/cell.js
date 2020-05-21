import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DraggableGate from "./draggableGate";
import ConnectionPanel from "./connectionPanel";
import ConnectionLine from "./connectionLine";

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
    connectionLines: {
        position: "absolute",
        userSelect: "none",
        top: 0,
        left: 0,
        zIndex: -1,
    }
}));

export default function Cell(props) {
    const classes = useStyles();

    /**
     * Apply type for autocomplete.
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
        console.log("dropped", gate, gate === undefined);
        setGateAndListeners(gate);
    }

    function onDragGateEnd(event) {
        event.preventDefault();
        setGateAndListeners(null);
    }

    function onClick(event) {
        if (cellLife.onGateClicked && cellLife.gate) {
            cellLife.onGateClicked(event);
        }
    }

    function gate() {
        if (!cellLife.gate) return null;

        return (
            <div className={classes.iconContainer}>
                <DraggableGate size="md" cellLife={cellLife} onDragEnd={onDragGateEnd} draggable/>
            </div>
        );
    }

    function connectionLines() {
        return (
            <div className={classes.connectionLines}>
                {cellLife.ends
                    .map(t => (
                        <ConnectionLine key={t} cellDistance={Math.abs(t - cellLife.wireIndex)}
                                        direction={(t - cellLife.wireIndex) > 0 ? "down" : "up"}/>)
                    )}
            </div>
        );

        return null;
    }

    return (
        // Use div with makeStyles here. Apparently it's faster for performance when we are rendering hundreds of these.
        <div className={classes.cellContainer}>
            <div className={classes.cell} onDragOver={onDraggedOver} onDrop={onDrop} onClick={onClick}>
                <div className={classes.wire}/>
                {gate()}
                {cellLife.gate && cellLife.isSelected ? <div className={classes.greenHighlight}/> : null}
            </div>

            {cellLife.shouldShowConnectionPanel() ?
                <ConnectionPanel className={classes.connectPanel} cellLife={cellLife}/> : null
            }

            {connectionLines()}
        </div>
    );
}