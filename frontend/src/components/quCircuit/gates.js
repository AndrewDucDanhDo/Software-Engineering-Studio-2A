import React from "react";
import LabeledGateIcon from "./labeledGateIcon";
import CNotGateIcon from "./cnotGateIcon";
import ControlGateIcon from "./controlGateIcon";

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

function createGate(component, targets) {
    return {
        component: component,
        targets: targets || [],
    }
}

export const GateProperties = {
    H: createGate((props) => (<LabeledGateIcon {...props} label="H"/>)),
    Y: createGate((props) => (<LabeledGateIcon {...props} label="Y"/>)),
    Z: createGate((props) => (<LabeledGateIcon {...props} label="Z"/>)),
    CNOT: createGate((props) => (<CNotGateIcon {...props}/>), [Gates.CONTROL]),
    CONTROL: createGate((props) => (<ControlGateIcon {...props}/>)),
    SWAP: createGate((props) => (<LabeledGateIcon {...props} label="SWAP" labelSize={2}/>), [Gates.SWAP]),
    R2: createGate((props) => (<LabeledGateIcon {...props} label="R2" labelSize={3.5}/>)),
    R4: createGate((props) => (<LabeledGateIcon {...props} label="R4" labelSize={3.5}/>)),
    R6: createGate((props) => (<LabeledGateIcon {...props} label="R6" labelSize={3.5}/>)),
};

export function getGateComponentOrEmpty(gate) {
    return GateProperties[gate].component ?? EmptyComponent;
}