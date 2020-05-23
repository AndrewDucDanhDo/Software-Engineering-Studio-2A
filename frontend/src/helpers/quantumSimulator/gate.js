export default class Gate {
  constructor(type, time, targets, controls) {
    this.type = type;
    this.time = time;
    this.targets = targets;
    this.controls = controls || [];
    const qubits = this.targets.concat(this.controls);
    this.range = [Math.min.apply(Math, qubits), Math.max.apply(Math, qubits)];
  }

  addControl(control) {
    if (
      this.controls.indexOf(control) < 0 &&
      this.targets.indexOf(control) < 0
    ) {
      this.controls.push(control);
      this.range[0] = Math.min(this.range[0], control);
      this.range[1] = Math.max(this.range[1], control);
    }
  }

  removeControl(control) {
    this.controls.splice(this.controls.indexOf(control), 1);
    const qubits = this.targets.concat(this.controls);
    this.range = [Math.min.apply(Math, qubits), Math.max.apply(Math, qubits)];
  }

  touching(time, qubit) {
    if (time !== this.time) {
      return false;
    }
    return this.range[0] <= qubit && qubit <= this.range[1];
  }
};
