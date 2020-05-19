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

    get selectedCellData() {
        return this.selectedCell && this.circuit[this.selectedCell.w][this.selectedCell.c];
    }

    get cellData() {
        return this.circuit[this.wireIndex] && this.circuit[this.wireIndex][this.cellIndex] ?
            this.circuit[this.wireIndex][this.cellIndex] : {};
    }

    get hasTargets() {
        return this.cellData.targets && this.cellData.targets.length > 0;
    }

    get isConnected() {
        return this.cellData.targets.includes(this.selectedCell.w)
    }

    get hasGate() {
        return this.cellData.gate
    }

    get isSelected() {
        return this.selectedCell
            && this.selectedCell.w === this.wireIndex
            && this.selectedCell.c === this.cellIndex;
    }

    get shouldShowConnectionPanel() {
        return this.selectedCellData
            && this.selectedCell.c === this.cellIndex
            && !this.isSelected
            && this.hasGate
            && GateProperties[this.selectedCellData.gate].targets.includes(this.cellData.gate);
    }
}