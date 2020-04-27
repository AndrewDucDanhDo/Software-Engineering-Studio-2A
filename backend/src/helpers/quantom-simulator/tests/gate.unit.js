const Gate = require("../gate.js");
import { expect } from "chai";
import sinon from "sinon";

describe("quantom-simulator", () => {
  describe("gate", () => {
    var gates = require("./data/gates.json");
    var gate;
    var i = 4;

    it("Should construct gate", () => {
      gate = new Gate(
        gates[i].type,
        gates[i].time,
        gates[i].targets,
        gates[i].controls
      );

      expect(gate.type).to.equal(gates[i].type);
      expect(gate.time).to.equal(gates[i].time);
      expect(gate.targets).to.equal(gates[i].targets);
      expect(gate.controls).deep.to.equal(gates[i].controls);
      expect(gate.range).deep.to.equal(gates[i].range);
    });

    it("Should add control and correct range", () => {
      gate.addControl(999);

      expect(gate.controls[gate.controls.length - 1]).to.equal(999);
      expect(gate.range).deep.to.equal([gates[i].range[0], 999]);

      gate.addControl(-1);

      expect(gate.controls[gate.controls.length - 1]).to.equal(-1);
      expect(gate.range).deep.to.equal([-1, 999]);
    });

    it("Should remove control and correct range", () => {
      gate.removeControl(999);
      gate.removeControl(-1);
      expect(gate.controls).deep.to.equal(gates[i].controls);
      expect(gate.range).deep.to.equal(gates[i].range);
    });

    it("Should check if touching", () => {
      expect(gate.touching(gate.time + 1, gate.range[0])).to.equal(false);
      expect(gate.touching(gate.time, gate.range[0] - 1)).to.equal(false);
      expect(gate.touching(gate.time, gate.range[1] + 1)).to.equal(false);
      expect(gate.touching(gate.time, gate.range[0])).to.equal(true);
      expect(gate.touching(gate.time, gate.range[1])).to.equal(true);
      expect(
        gate.touching(gate.time, (gate.range[0] + gate.range[1]) / 2)
      ).to.equal(true);
      expect(
        gate.touching(gate.time + 1, (gate.range[0] + gate.range[1]) / 2)
      ).to.equal(false);
      expect(
        gate.touching(gate.time, (gate.range[0] + gate.range[1]) / 2)
      ).to.equal(true);
    });
  });
});
