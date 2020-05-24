import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import DraggableGate from "./draggableGate";
import ConnectionPanel from "./connectionPanel";
import ConnectionLine from "./connectionLine";
import SimpleLine from "./simpleLine";
import useTheme from "@material-ui/core/styles/useTheme";
import { VToPixels } from "../../helpers/domUnits";

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
        left: 0,
        top: 0,
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

function Cell(props) {
    const theme = useTheme();
    const classes = useStyles();

    /**
     * Apply for type checking and autocomplete.
     * @type {CellLife}
     */
    let cellLife = props.cellLife;

    function onDragStart(event) {
        event.dataTransfer.setData("wireIndex", cellLife.wireIndex.toString());
        event.dataTransfer.setData("cellIndex", cellLife.cellIndex.toString());
    }

    function onDraggedOver(event) {
        event.preventDefault();
    }

    function onDrop(event) {
        event.preventDefault();

        let gate = event.dataTransfer.getData("gate");
        cellLife.onGateChanged(gate);
    }

    function onDragGateEnd(event) {
        event.preventDefault();
    }

    function onClick(event) {
        if (cellLife.gate) {
            cellLife.onGateClicked(event);
        }
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
    }

    return (
        // Use div with makeStyles here. Apparently it's faster for performance when we are rendering hundreds of these.
        <div className={classes.cellContainer}>
            <div className={classes.cell} onDragOver={onDraggedOver} onDrop={onDrop} onClick={onClick} onDragStart={onDragStart}>
                <div className={classes.wire}>
                    <SimpleLine direction="horizontal" size={VToPixels(theme.circuitCellSize(1))}/>
                </div>

                {cellLife.gate ? (
                    <div className={classes.iconContainer}>
                        <DraggableGate size="md" cellLife={cellLife} onDragEnd={onDragGateEnd} draggable/>
                    </div>
                ) : null}

                {cellLife.gate && cellLife.isSelected ? <div className={classes.greenHighlight}/> : null}
            </div>

            {cellLife.shouldShowConnectionPanel() ?
                <ConnectionPanel className={classes.connectPanel} cellLife={cellLife}/> : null
            }

            {connectionLines()}
        </div>
    );
}

function areEqual(prevProps, nextProps) {
    /**
     * Apply for type checking and autocomplete.
     * @type {CellLife}
     */
    let prevCellLife = prevProps.cellLife;
    /**
     * Apply for type checking and autocomplete.
     * @type {CellLife}
     */
    let nextCellLife = nextProps.cellLife;

    return prevCellLife.wireIndex === nextCellLife.wireIndex
        && prevCellLife.cellIndex === nextCellLife.wireIndex
        && prevCellLife.ends === nextCellLife.ends
        && prevCellLife.sources === nextCellLife.sources
        && prevCellLife.multigates === nextCellLife.multigates
}

export default React.memo(Cell, areEqual);