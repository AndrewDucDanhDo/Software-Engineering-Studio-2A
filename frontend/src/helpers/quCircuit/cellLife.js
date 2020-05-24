import CellData from "./cellData";
import { GateProperties } from "./gates";

export default class CellLife {

    constructor(wireIndex, cellIndex, circuit, selectedCell, listeners) {
        this.wireIndex = parseInt(wireIndex);
        this.cellIndex = parseInt(cellIndex);
        this.circuit = circuit;
        this.listeners = listeners;
        this.selectedCell = selectedCell;

        if (isNaN(this.wireIndex))
            throw new Error(`Expected number for wire index got ${this.wireIndex} of type ${typeof this.wireIndex}`);
        if (isNaN(this.cellIndex))
            throw new Error(`Expected number for wire index got ${this.cellIndex} of type ${typeof this.cellIndex}`);
    }

    onGateClicked(event) {
        if (this.listeners.onGateClicked) {
            this.listeners.onGateClicked(this, event);
        }
    }

    onGateChanged(gate) {
        if (this.listeners.onGateChanged) {
            this.listeners.onGateChanged(this, gate);
        }
    }

    onConnect(event) {
        if (this.listeners.onConnect) {
            this.listeners.onConnect(this, event);
        }
    }

    onDisconnect(event) {
        if (this.listeners.onDisconnect) {
            this.listeners.onDisconnect(this, event);
        }
    }

    onGrowMultigate(wireIndex) {
        if (this.listeners.onGrowMultigate) {
            this.listeners.onGrowMultigate(this, wireIndex);
        }
    }

    copyOfPosition(wireIndex, cellIndex) {
        return new CellLife(wireIndex, cellIndex, this.circuit, this.selectedCell, this.listeners)
    }

    /**
     * @returns {CellData}
     */
    get cellData() {
        return this.circuit[this.wireIndex] && this.circuit[this.wireIndex][this.cellIndex] ?
            this.circuit[this.wireIndex][this.cellIndex] : new CellData(this.wireIndex, this.cellIndex);
    }

    get gate() {
        return this.cellData.gate;
    }

    get ends() {
        return this.cellData.ends || [];
    }

    get sources() {
        return this.cellData.sources || [];
    }

    get multigates() {
        return this.cellData.multigates || [];
    }

    get topMultigate() {
        return this.copyOfPosition(this.multigates[0], this.cellIndex);
    }

    get bottomMultigate() {
        return this.copyOfPosition(this.multigates[this.multigates.length - 1], this.cellIndex);
    }

    get isTopMultigate() {
        return this.multigates[0] === this.wireIndex;
    }

    get isBottomMultigate() {
        return this.multigates[this.multigates.length - 1] === this.wireIndex;
    }

    /**
     * @returns {GateProperty}
     */
    get property() {
        return GateProperties[this.gate];
    }

    get hasEnds() {
        return this.ends.length > 0;
    }

    get hasSources() {
        return this.sources.length > 0;
    }

    get isMultigate() {
        return this.multigates.length > 0;
    }

    get isConnected() {
        return this.selectedCell && this.ends.includes(this.selectedCell.wireIndex)
    }

    get isSelected() {
        return this.selectedCell
            && this.selectedCell.wireIndex === this.wireIndex
            && this.selectedCell.cellIndex === this.cellIndex;
    }

    shouldShowConnectionPanel() {
        if (this.selectedCell && this.selectedCell.gate) {
            let selectedProperties = GateProperties[this.selectedCell.gate];

            let shouldShow = this.gate
                && this.selectedCell.cellIndex === this.cellIndex
                && !this.isSelected
                && (!this.hasEnds || this.hasEndCell(this.selectedCell))
                && selectedProperties.validEnds.includes(this.gate)
                && (this.selectedCell.hasEndCell(this) || this.selectedCell.ends.length < selectedProperties.maxEnds);

            return shouldShow;
        }
        return false;
    }

    get circuitWireCount() {
        return this.circuit.length;
    }

    get circuitCellCount() {
        return this.circuit[this.wireIndex].length;
    }

    removeEnd(wireIndex) {
        if (this.hasEnd(wireIndex)) {
            this.ends.splice(this.ends.indexOf(wireIndex), 1);
            this.cellData.ends = [...this.ends];
        }
    }

    removeSource(wireIndex) {
        if (this.hasSource(wireIndex)) {
            this.sources.splice(this.sources.indexOf(wireIndex), 1);
            this.cellData.sources = [...this.sources];
        }
    }

    addEnd(wireIndex) {
        if (!this.hasEnd(wireIndex)) {
            this.cellData.ends = [...this.cellData.ends, wireIndex];
        }
    }

    addSource(wireIndex) {
        if (!this.hasSource(wireIndex)) {
            this.cellData.sources = [...this.cellData.sources, wireIndex];
        }
    }

    growMultigateUp() {
        if (this.wireIndex !== 0) {
            this.onGrowMultigate(this.wireIndex - 1);
        }
    }

    growMultigateDown() {
        if (this.wireIndex !== this.circuitWireCount - 1) {
            this.onGrowMultigate(this.wireIndex + 1);
        }
    }

    shrinkMultigateDown() {
        if (this.multigates.length > 0 && this.wireIndex !== 0) {
            this.copyOfPosition(this.wireIndex - 1, this.cellIndex)
                .removeCell();
        }
    }

    shrinkMultigateUp() {
        if (this.multigates.length > 0 && this.wireIndex !== this.circuitWireCount - 1) {
            this.copyOfPosition(this.wireIndex + 1, this.cellIndex)
                .removeCell();
        }
    }

    createConnectionTo(otherCell) {
        this.addEnd(otherCell.wireIndex);
        otherCell.addSource(this.wireIndex);

        // Check if cell can connect to itself.
        if (this.gate && GateProperties[this.gate].canConnectToItself) {
            otherCell.addEnd(this.wireIndex);
            this.addSource(otherCell.wireIndex);
        }
    }

    removeMultigates() {
        if (!this.isMultigate) return;
        this.cellData._isMultigateRemoved = true;

        for (let m of this.multigates) {
            if (m !== this.wireIndex) {
                let nextCellLife = this.copyOfPosition(m, this.cellIndex);

                if (!nextCellLife.cellData._isMultigateRemoved) {
                    nextCellLife.removeCell();
                }
            }
        }
        delete this.cellData._isMultigateRemoved;
    }

    removeConnectionTo(otherCell) {
        this.removeEnd(otherCell.wireIndex);
        otherCell.removeSource(this.wireIndex);

        // Check if cell can connect to itself.
        if (this.gate && GateProperties[this.gate].canConnectToItself) {
            otherCell.removeEnd(this.wireIndex);
            this.removeSource(otherCell.wireIndex);
        }
    }

    createConnectionToSelected() {
        this.createConnectionTo(this.selectedCell);
    }

    removeConnectionToSelected() {
        this.removeConnectionTo(this.selectedCell);
    }

    removeCell() {
        this.onGateChanged(null);
    }

    removeAllConnections() {
        this.getEndCells()
            .forEach(cell => {
                cell.removeSource(this.wireIndex);
                this.removeEnd(cell.wireIndex);
            });

        this.getSourceCells()
            .forEach(cell => {
                cell.removeEnd(this.wireIndex);
                this.removeSource(cell.wireIndex);
            });

        this.cellData.ends = [];
        this.cellData.sources = [];
    }

    hasEnd(wireIndex) {
        return this.ends.includes(wireIndex);
    }

    hasSource(wireIndex) {
        return this.sources.includes(wireIndex);
    }

    hasEndCell(cell) {
        return this.ends.includes(cell.wireIndex);
    }

    hasSourceCell(cell) {
        return this.sources.includes(cell.wireIndex);
    }

    hasEndsBelow(wireIndex) {
        return this.ends.filter(t => t > wireIndex).length;
    }

    hasEndsAbove(wireIndex) {
        return this.ends.filter(t => t < wireIndex).length;
    }

    hasSourcesBelow(wireIndex) {
        return this.sources.filter(t => t > wireIndex).length;
    }

    hasSourcesAbove(wireIndex) {
        return this.sources.filter(t => t < wireIndex).length;
    }

    getCellsAbove() {
        let result = [];

        for (let w = this.wireIndex - 1; w >= 0; w--) {
            result.push(this.copyOfPosition(w, this.cellIndex));
        }
        return result;
    }

    getCellsBelow() {
        let result = [];

        for (let w = this.wireIndex + 1; w < this.circuitWireCount; w++) {
            result.push(this.copyOfPosition(w, this.cellIndex));
        }
        return result;
    }

    getColumnCells() {
        let result = [];

        for (let w = 0; w < this.circuitWireCount; w++) {
            if (w !== this.wireIndex) {
                result.push(this.copyOfPosition(w, this.cellIndex));
            }
        }
        return result;
    }

    getSourceCells() {
        return this.sources.map(con => this.copyOfPosition(con, this.cellIndex));
    }

    getEndCells() {
        return this.ends.map(t => this.copyOfPosition(t, this.cellIndex));
    }

    getMultigateCells() {
        return this.multigates.map(m => this.copyOfPosition(m, this.cellIndex))
    }

    getDirectionTowards(wireIndex) {
        return this.wireIndex - wireIndex > 0 ? "up" : "down";
    }

    getDirectionAwayFrom(wireIndex) {
        return this.wireIndex - wireIndex < 0 ? "up" : "down";
    }

    samePositionAs(otherCell) {
        return this.wireIndex === otherCell.wireIndex && this.cellIndex === otherCell.cellIndex;
    }

    isInterferingWith(otherCell) {
        let direction = this.getDirectionTowards(otherCell.wireIndex);
        return direction === "up" ? otherCell.hasSourcesBelow(this.wireIndex)
            : otherCell.hasSourcesAbove(this.wireIndex);
    }

    getDisturbedCell() {
        for (let cell of this.getColumnCells()) {
            if (cell.gate && this.isInterferingWith(cell))
                return cell;
        }
        return null;
    }

    toString() {
        return this.gate ? `CellLife(gate(${this.gate}) ends[${this.ends}] sources[${this.sources}])` : `(Empty Cell)`
    }
}