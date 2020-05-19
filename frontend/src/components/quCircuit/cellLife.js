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
        return this.gate
            && this.selectedCell
            && this.selectedCell.cellIndex === this.cellIndex
            && !this.isSelected
            && this.selectedCell.gate // Extra safety, prevents crash when moving gate on top of itself.
            && GateProperties[this.selectedCell.gate].targets.includes(this.gate)
            && (!this.hasTargets || this.hasTargetCell(this.selectedCell));
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

    pushTarget(wireIndex) {
        if (!this.hasTarget(wireIndex)) {
            this.targets.push(wireIndex);
        }
    }

    pushControl(wireIndex) {
        if (!this.hasControl(wireIndex)) {
            this.controls.push(wireIndex);
        }
    }

    createConnectionToSelected() {
        this.pushTarget(this.selectedCell.wireIndex);
        this.selectedCell.pushControl(this.wireIndex);
    }

    removeConnectionToSelected() {
        console.log("removing", this, "from ", this.selectedCell);
        this.removeTarget(this.selectedCell.wireIndex);
        this.selectedCell.removeControl(this.wireIndex);
    }

    removeAllConnections() {
        this.getTargetCells()
            .forEach(cell => {
                cell.removeControl(this.wireIndex);
                this.removeTarget(cell.wireIndex);
            });

        this.getControlCells()
            .forEach(cell => {
                cell.removeTarget(this.wireIndex);
                this.removeControl(cell.wireIndex);
            });

        this.cellData.targets = [];
        this.cellData.controls = [];
    }

    hasTarget(wireIndex) {
        return this.targets.includes(wireIndex);
    }

    hasControl(wireIndex) {
        return this.controls.includes(wireIndex);
    }

    hasTargetCell(cell) {
        return this.targets.includes(cell.wireIndex);
    }

    hasTargetCell(cell) {
        return this.targets.includes(cell.wireIndex);
    }

    hasTargetsBelow(wireIndex) {
        return this.targets.filter(t => t > wireIndex).length;
    }

    hasTargetsAbove(wireIndex) {
        return this.targets.filter(t => t < wireIndex).length;
    }

    hasControlsBelow(wireIndex) {
        return this.controls.filter(t => t > wireIndex).length;
    }

    hasControlsAbove(wireIndex) {
        return this.controls.filter(t => t < wireIndex).length;
    }

    getCellsAbove() {
        let result = [];

        for (let w = this.wireIndex - 1; w >= 0; w--) {
            result.push(new CellLife(w, this.cellIndex, this.circuit, this.selectedCell));
        }

        return result;
    }

    getCellsBelow() {
        let result = [];

        for (let w = this.wireIndex + 1; w < this.circuitWireCount; w++) {
            result.push(new CellLife(w, this.cellIndex, this.circuit, this.selectedCell));
        }

        return result;
    }

    getControlCells() {
        return this.controls.map(con => new CellLife(con, this.cellIndex, this.circuit, this.selectedCell));
    }

    getTargetCells() {
        return this.targets.map(t => new CellLife(t, this.cellIndex, this.circuit, this.selectedCell));
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

    toString() {
        return this.gate ? `CellLife(gate(${this.gate}) targets[${this.targets}] controls[${this.controls}])` : `(Empty cell)`
    }
}