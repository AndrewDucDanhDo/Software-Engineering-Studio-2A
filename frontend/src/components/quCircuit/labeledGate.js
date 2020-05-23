import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { VToPixels } from "../../helpers/domUnits";
import ResizeRect from "./resizeRect";

const useStyle = makeStyles({
    floating: {
        position: "absolute",
    },
    upResizeRect: {
        cursor: "n-resize",
        fill: "black",
        // fillOpacity: 0,
    },
    downResizeRect: {
        cursor: "s-resize",
        fill: "black",
        // fillOpacity: 0,
    },
    rect: {
        fill: "white",
        stroke: "black",
        strokeWidth: 4,
        resize: "vertical",
    },
    label: {
        dominantBaseline: "middle",
        textAnchor: "middle",
        userSelect: "none",
    }
});

export default function LabeledGate(props) {
    const theme = useTheme();
    const classes = useStyle();
    let size = props.size || 100;
    let label = props.label || "G";
    /**
     * Apply for type checking and autocomplete.
     * @type {CellLife}
     */
    let cellLife = props.cellLife;
    let cellSize = VToPixels(theme.circuitCellSize(1));
    let leftOverSize = cellSize - size;
    let labelSize = props.labelSize || 4;
    let fontSize = (labelSize * size) / 100;
    let shouldShow = true;
    let element;

    if (cellLife && cellLife.isMultigate) {
        shouldShow = cellLife.isTopMultigate || cellLife.isBottomMultigate;
        let quarterSize = size / 4;
        let height = size + (size + leftOverSize) * (cellLife.multigates.length - 1);
        let resizable = cellLife.property.isResizable;

        if (cellLife.isTopMultigate) {
            console.log("refresh master multigate with", cellLife.multigates, "at", cellLife);
        }

        function onResizeTop(direction) {
            if (direction === "up") {
                cellLife.growMultigateUp();
            } else {
                cellLife.shrinkMultigateDown();
            }
        }

        function onResizeBottom(direction) {
            if (direction === "down") {
                cellLife.growMultigateDown();
            } else {
                cellLife.shrinkMultigateUp()
            }
        }

        element = (
            <svg height={height} width={size} className={classes.floating} style={{left: quarterSize, top: quarterSize}}>

                {cellLife.isTopMultigate ? (
                    <g>
                        <rect width={size} height={height} className={classes.rect}/>
                        <text fontSize={`${fontSize}em`} x="50%" y="50%" className={classes.label}>{label}</text>
                    </g>
                ) : null}

                {resizable ? (
                    <g>
                        {cellLife.isTopMultigate ? (
                            // <rect onMouseDown={() => cellLife.growMultigateUp()}
                            <ResizeRect onResize={onResizeTop} lockdirection="vertical"
                                        y={0} width={size} height={quarterSize} className={classes.upResizeRect}/>
                        ) : null}
                        {cellLife.isBottomMultigate ? (
                            // <rect onMouseDown={() => cellLife.growMultigateDown()}
                            <ResizeRect onResize={onResizeBottom} lockdirection="vertical"
                                        y={size - quarterSize} width={size} height={quarterSize} className={classes.downResizeRect}/>
                        ) : null}
                    </g>
                ) : null}
            </svg>
        );
    } else {
        element = (
            <svg height={size} width={size}>
                <rect width={size} height={size} className={classes.rect}/>
                <text fontSize={`${fontSize}em`} x="50%" y="50%" className={classes.label}>{label}</text>
            </svg>
        );
    }

    return (
        <>
            {shouldShow ? element : null}
        </>
    );
}