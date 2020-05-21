import { GateProperties } from "./gates";
import CellData from "./cellData";

export default class CellLife {

    constructor(wireIndex, cellIndex, circuit, selectedCell) {
        this.wireIndex = wireIndex;
        this.cellIndex = cellIndex;
        this.circuit = circuit;
        this.selectedCell = selectedCell;

        // Declare available listeners here for clarity and autocomplete availability.
        this.onGateClicked = (gate) => {};
        this.onGateChanged = (event) => {};
        this.onConnect = (event) => {};
        this.onDisconnect = (event) => {};
    }

    copyOfPosition(wireIndex, cellIndex) {
        return new CellLife(wireIndex, cellIndex, this.circuit, this.selectedCell)
    }

    /**
     * @returns {CellData}
     */
    get cellData() {
        return this.circuit[this.wireIndex] && this.circuit[this.wireIndex][this.cellIndex] ?
            this.circuit[this.wireIndex][this.cellIndex] : new CellData();
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

    get hasEnds() {
        return this.ends.length > 0;
    }

    get hasSources() {
        return this.sources.length > 0;
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
        return this.gate
            && this.selectedCell
            && this.selectedCell.cellIndex === this.cellIndex
            && !this.isSelected
            && this.selectedCell.gate // Extra safety, prevents crash when moving gate on top of itself.
            && GateProperties[this.selectedCell.gate].validEnds.includes(this.gate)
            && (!this.hasEnds || this.hasEndCell(this.selectedCell));
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
        }
    }

    removeSource(wireIndex) {
        if (this.hasSource(wireIndex)) {
            this.sources.splice(this.sources.indexOf(wireIndex), 1);
        }
    }

    addEnd(wireIndex) {
        if (!this.hasEnd(wireIndex)) {
            this.cellData.ends.push(wireIndex);
        }
    }

    addSource(wireIndex) {
        if (!this.hasSource(wireIndex)) {
            this.cellData.sources.push(wireIndex);
        }
    }

    createConnectionTo(otherCell) {
        this.addEnd(otherCell.wireIndex);
        otherCell.addSource(this.wireIndex);
    }

    removeConnectionTo(otherCell) {
        this.removeEnd(otherCell.wireIndex);
        otherCell.removeSource(this.wireIndex);
    }

    createConnectionToSelected() {
        this.createConnectionTo(this.selectedCell);
    }

    removeConnectionToSelected() {
        this.removeConnectionTo(this.selectedCell);
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