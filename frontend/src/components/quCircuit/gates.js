import React from "react";
import LabeledGate from "./labeledGate";
import CNotGate from "./CNotGate";
import ControlGate from "./controlGate";

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

function establishGate(component, validEnds) {
    return {
        component: component,
        validEnds: validEnds || [Gates.CONTROL],
    }
}

export const GateProperties = {
    H: establishGate((props) => (<LabeledGate {...props} label="H"/>)),
    Y: establishGate((props) => (<LabeledGate {...props} label="Y"/>)),
    Z: establishGate((props) => (<LabeledGate {...props} label="Z"/>)),
    CNOT: establishGate((props) => (<CNotGate {...props}/>)),
    CONTROL: establishGate(ControlGate, []),
    SWAP: establishGate((props) => (<LabeledGate {...props} label="SWAP" labelSize={2}/>), [Gates.SWAP]),
    R2: establishGate((props) => (<LabeledGate {...props} label="R2" labelSize={3.5}/>)),
    R4: establishGate((props) => (<LabeledGate {...props} label="R4" labelSize={3.5}/>)),
    R6: establishGate((props) => (<LabeledGate {...props} label="R6" labelSize={3.5}/>)),
};

export function getGateComponentOrEmpty(gate) {
    return GateProperties[gate] ? GateProperties[gate].component : EmptyComponent;
}

export function getGateComponent(gate) {
    if (!GateProperties[gate]) {
        throw new Error(`Expected an actual gate but got ${gate}`);
    }
    return GateProperties[gate].component;
}