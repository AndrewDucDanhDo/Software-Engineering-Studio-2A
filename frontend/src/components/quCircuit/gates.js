import React from "react";
import LabeledGate from "./labeledGate";
import ControlGate from "./controlGate";
import CNotGate from "./CNotGate";
import SwapGate from "./swapGate";

const EmptyComponent = () => (<></>);

export const Gates = {
    H: "H",
    Y: "Y",
    Z: "Z",
    CNOT: "CNOT",
    CONTROL: "CONTROL",
    SWAP: "SWAP",
    R2: "R2",
    R4: "R4",
    R6: "R6",
};


export const GateProperties = {};

export class GateProperty {

    constructor(gate, component, validEnds) {
        this.gate = gate;
        this.component = component;
        this.validEnds = validEnds || [Gates.CONTROL];
        this.canConnectToItself = false;
        this.maxEnds = Number.MAX_VALUE;
        GateProperties[gate] = this;
    }
}

let h = new GateProperty(Gates.H, (props) => (<LabeledGate {...props} label="H"/>));
let y = new GateProperty(Gates.Y, (props) => (<LabeledGate {...props} label="Y"/>));
let z = new GateProperty(Gates.Z, (props) => (<LabeledGate {...props} label="Z"/>));
let cnot = new GateProperty(Gates.CNOT, (props) => (<CNotGate {...props}/>));
let control = new GateProperty(Gates.CONTROL, ControlGate, []);
let swap = new GateProperty(Gates.SWAP, SwapGate, [Gates.SWAP]);
swap.canConnectToItself = true;
swap.maxEnds = 1;
let r2 = new GateProperty(Gates.R2, (props) => (<LabeledGate {...props} label="R2" labelSize={3.5}/>));
let r4 = new GateProperty(Gates.R4, (props) => (<LabeledGate {...props} label="R4" labelSize={3.5}/>));
let r6 = new GateProperty(Gates.R6, (props) => (<LabeledGate {...props} label="R6" labelSize={3.5}/>));


export function getGateComponentOrEmpty(gate) {
    return GateProperties[gate] ? GateProperties[gate].component : EmptyComponent;
}

export function getGateComponent(gate) {
    if (!GateProperties[gate]) {
        throw new Error(`Expected an actual gate but got ${gate}`);
    }
    return GateProperties[gate].component;
}