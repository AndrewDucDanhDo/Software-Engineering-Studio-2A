
export default class CellData {

    constructor(gate, ends, sources) {
        this.gate = gate || null;
        this.ends = ends || [];
        this.sources = sources || [];
    }
}