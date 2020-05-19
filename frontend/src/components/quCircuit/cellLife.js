import { GateProperties } from "./gates";

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

    get cellData() {
        return this.circuit[this.wireIndex] && this.circuit[this.wireIndex][this.cellIndex] ?
            this.circuit[this.wireIndex][this.cellIndex] : {};
    }

    get gate() {
        return this.cellData.gate;
    }

    get targets() {
        return this.cellData.targets || [];
    }

    get controls() {
        return this.cellData.controls || [];
    }

    get hasTargets() {
        return this.targets.length > 0;
    }

    get hasControls() {
        return this.controls.length > 0;
    }

    get isConnected() {
        return this.selectedCell && this.targets.includes(this.selectedCell.wireIndex)
    }

    get isSelected() {
        return this.selectedCell
            && this.selectedCell.wireIndex === this.wireIndex
            && this.selectedCell.cellIndex === this.cellIndex;
    }

    shouldShowConnectionPanel() {
        return this.selectedCell
            && this.selectedCell.cellIndex === this.cellIndex
            && !this.isSelected
            && this.gate
            && GateProperties[this.selectedCell.gate].targets.includes(this.gate);
    }

    get circuitWireCount() {
        return this.circuit.length;
    }

    get circuitCellCount() {
        return this.circuit[this.wireIndex].length;
    }

    removeTarget(wireIndex) {
        if (this.hasTarget(wireIndex)) {
            this.targets.splice(this.targets.indexOf(wireIndex), 1);
        }
    }

    removeControl(wireIndex) {
        if (this.hasControl(wireIndex)) {
            this.controls.splice(this.controls.indexOf(wireIndex), 1);
        }
    }

    addTarget(wireIndex) {
        if (!this.cellData.targets)
            this.cellData.targets = [];
        this.cellData.targets.push(wireIndex);
    }

    addControl(wireIndex) {
        if (!this.cellData.controls)
            this.cellData.controls = [];
        this.cellData.controls.push(wireIndex);
    }

    hasTarget(wireIndex) {
        return this.targets.includes(wireIndex)
    }

    hasControl(wireIndex) {
        return this.controls.includes(wireIndex);
    }

    getCellsAbove() {
        let results = [];

        for (let w = this.wireIndex - 1; w >= 0; w--) {
            results.push(new CellLife(w, this.cellIndex, this.circuit, this.selectedCell));
        }

        return results;
    }

    getCellsBelow() {
        let results = [];

        for (let w = this.wireIndex + 1; w < this.circuitWireCount; w++) {
            results.push(new CellLife(w, this.cellIndex, this.circuit, this.selectedCell));
        }

        return results;
    }

    toString() {
        return this.gate ? `CellLife(gate(${this.gate}) targets[${this.targets}] controls[${this.controls}])` : `(Empty cell)`
    }
}