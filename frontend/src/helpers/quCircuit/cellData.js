import { GateProperties } from "./gates";

export default class CellData {

	constructor(wireIndex, cellIndex, gate, ends, sources, multigates) {
		this.wireIndex = wireIndex;
		this.cellIndex = cellIndex;
		this.gate = gate || null;
		this.ends = ends || [];
		this.sources = sources || [];
		this.multigates = multigates || this.multigates || [];
	}

	get gate() {
		return this._gate;
	}

	set gate(value) {
		this._gate = value;

		if (value) {
			let properties = GateProperties[value];
			this.multigates = properties.isMultigate ? [this.wireIndex] : [];
		}
	}
}