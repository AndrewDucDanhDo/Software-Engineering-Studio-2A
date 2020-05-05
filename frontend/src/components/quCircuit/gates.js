import hadmardGateIcon from "../../quantumGates/hadmard_gate_icon.svg";
import xGateIcon from "../../quantumGates/x_gate_icon.svg";
import yGateIcon from "../../quantumGates/y_gate_icon.svg";
import zGateIcon from "../../quantumGates/z_gate_icon.svg";

const svgIcons = {
    H: hadmardGateIcon,
    Y: yGateIcon,
    X: xGateIcon,
    Z: zGateIcon
};

const gates = {
    X: "X",
    Y: "Y",
    Z: "Z",
    H: "H",

    getSvgPath: (gate) => {
        return svgIcons[gate];
    },
};

export default gates;