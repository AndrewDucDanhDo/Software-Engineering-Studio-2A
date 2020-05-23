import React from "react";
import LabeledGate from "../../components/quCircuit/labeledGate";
import CNotGate from "../../components/quCircuit/CNotGate";
import ControlGate from "../../components/quCircuit/controlGate";
import SwapGate from "../../components/quCircuit/swapGate";

const EmptyComponent = () => (<></>);

export const Gates = {
    H: "H",
    Y: "Y",
    Z: "Z",
    S: "S",
    CNOT: "CNOT",
    CONTROL: "CONTROL",
    SWAP: "SWAP",
    R2: "R2",
    R4: "R4",
    R8: "R8",
    QFT: "QFT",
    SRN: "SRN",
};


export const GateProperties = {};

export class GateProperty {

    constructor(gate, component, validEnds) {
        this.gate = gate;
        this.component = component;
        this.validEnds = validEnds || [Gates.CONTROL];
        this.canConnectToItself = false;
        this.isMultigate = false;
        this.isResizable = false;
        this.maxEnds = Number.MAX_VALUE;
        GateProperties[gate] = this;
    }
}

let h = new GateProperty(Gates.H, (props) => (<LabeledGate {...props} label="H"/>));
let y = new GateProperty(Gates.Y, (props) => (<LabeledGate {...props} label="Y"/>));
let z = new GateProperty(Gates.Z, (props) => (<LabeledGate {...props} label="Z"/>));
let s = new GateProperty(Gates.S, (props) => (<LabeledGate {...props} label="S"/>));
let cnot = new GateProperty(Gates.CNOT, (props) => (<CNotGate {...props}/>));
let control = new GateProperty(Gates.CONTROL, ControlGate, []);
let swap = new GateProperty(Gates.SWAP, SwapGate, [Gates.SWAP]);
swap.canConnectToItself = true;
swap.maxEnds = 1;
let r2 = new GateProperty(Gates.R2, (props) => (<LabeledGate {...props} label="R2" labelSize={3.5}/>));
let r4 = new GateProperty(Gates.R4, (props) => (<LabeledGate {...props} label="R4" labelSize={3.5}/>));
let r8 = new GateProperty(Gates.R8, (props) => (<LabeledGate {...props} label="R8" labelSize={3.5}/>));
let qft = new GateProperty(Gates.QFT, (props) => (<LabeledGate {...props} label="QFT" labelSize={2.5}/>));
qft.isMultigate = true;
qft.isResizable = true;
let srn = new GateProperty(Gates.SRN, (props) => (<LabeledGate {...props} label="SRN" labelSize={2.5}/>));


export function getGateComponentOrEmpty(gate) {
    return GateProperties[gate] ? GateProperties[gate].component : EmptyComponent;
}

export function getGateComponent(gate) {
    if (!GateProperties[gate]) {
        throw new Error(`Expected an actual gate but got ${gate}`);
    }
    return GateProperties[gate].component;
}