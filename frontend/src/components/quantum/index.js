import React from "react";
import QuantumMenuBar from "./quantumMenuBar";
import {Box} from "@material-ui/core"

// TODO: Updated image asset paths to point to new quantum folder

export default class QuantumSimulator extends React.Component {

	constructor(props) {
		super(props);

	}

	componentDidMount() {
		window.onload();
	}

	render() {
		return (
			<Box>
				<QuantumMenuBar/>

				<Box style={{clear: "both"}}>
					<Box id="content" style={{float: "left"}}>
						<Box id="toolbar">
							<Box class="std"></Box>
							<Box class="user"></Box>
						</Box>
						<Box>
							<canvas id="canvas"></canvas>
						</Box>
						<Box id="progress">
							<Box></Box>
						</Box>
					</Box>
					<Box id="amplitudes-container">
						<Box id="hide-impossible">(show all)</Box>
						<Box id="amplitudes-scrollbox">
							<table id="amplitudes"></table>
						</Box>
					</Box>
				</Box>

				{/* About modal dialog*/}
				<Box>
					<Box id="modal" style={{textAlign: "left"}}>
						<Box>
							<h1 style={{textAlign: "center"}}>Quantum Circuit Simulator</h1>
							<p>
								Written by <a href="http://www.davyw.com">Davy Wybiral</a>.<br></br>
								Contributions by <a href="http://molehair.noip.me">Jiman Hwang</a>
							</p>
							<p>
								<h3>Purpose:</h3>
								This is a quantum circuit simulator designed to function as a
								learning tool for anyone interested in quantum computing. It has a
								friendly GUI for constructing and evaluating quantum circuits.
								Rather than constructing one simple circuit, it's designed to
								support modular circuit design. Any circuit you make can be compiled
								into a gate for use in other circuits.
								<br></br>
								The default gates in use were chosen because they appear frequently
								in literature. There does seem to be a mix of conventions regarding
								rotation gates. To avoid confusion, this is the matrix used to
								construct all of the Rx gates used by this application:
								<p style={{textAlign: "center"}}>
									<img src="images/r.png"></img>
								</p>
							</p>
							<p>
								<h3>The basics:</h3>
								<ul>
									<li>
										Click on the qubits to the left of the circuit wires to toggle
										the input state.
									</li>
									<li>
										Click on a quantum gate (above the circuit wires) to select that
										gate type. Then click on a circuit wire to place the selected
										gate there.
									</li>
									<li>
										For gates over multiple qubits, such as the swap or QFT gates,
										click and drag across desired qubits.
									</li>
									<li>Right clicking will delete a gate.</li>
								</ul>
							</p>
							<p>
								<h3>Controls:</h3>
								<ul>
									<li>
										Any gate can be made into a controlled version of itself by
										selecting the control gate (the black dot) and dragging from the
										control qubit to the target gate.
									</li>
									<li>
										Dragging a control onto an X gate will result in a CNot gate.
									</li>
									<li>Multiple controls can be added to a single gate.</li>
									<li>
										Dragging two controls to an X will result in a Toffoli gate.
									</li>
									<li>
										Right clicking on a control will remove it from the gate without
										removing the gate itself.
									</li>
								</ul>
							</p>
							<p>
								<h3>Evaluate:</h3>
								<ul>
									<li>
										You can evaluate your circuit by either clicking the{" "}
										<b>Evaluate</b> option in the <b>Circuit</b> menu or by pressing{" "}
										<b>Enter</b>.
									</li>
									<li>
										Evaluating the circuit will apply the circuit to the current
										input state (on the left of the circuit wires) and display a
										table of resulting probabilities (on the right of the circuit
										wires).
									</li>
									<li>
										Each line in the probabilities table is of the form "a+bi|x> p%"
										where "a+bi" is a complex number (the amplitude), "x" is a
										possible binary state for the entire system, and "p" is a
										percent probability that a measurement would result in that
										state.
									</li>
									<li>
										By default, states with 0% probability are hidden. Click "(show
										all)" above the table to display zero and nonzero probabilities.
									</li>
								</ul>
							</p>
							<p>
								<h3>Compile:</h3>
								<ul>
									<li>
										You can compile your circuit by either clicking the{" "}
										<b>Compile</b> option in the <b>Circuit</b> menu or by pressing{" "}
										<b>Ctrl+S</b>.
									</li>
									<li>
										Compiling your circuit will create a gate containing the visible
										circuit to be used in larger circuits.
									</li>
									<li>
										Once compiled, you can double-click on the gate in the toolbar
										to open it's circuit.
									</li>
									<li>
										Saving a gate with the same name as an existing one will
										overwrite the existing gate. This does not update gates that use
										this circuit. They will need to be "recompiled" too.
									</li>
								</ul>
							</p>
							<p>
								<h3>Exporting:</h3>
								<ul>
									<li>
										You can export all of the gates you've created into a JSON
										format by clicking on the <b>Export JSON</b>
										option in the <b>Workspace</b> menu.
									</li>
									<li>
										This exported JSON text can be reimported at a later time by
										clicking on the <b>Import JSON</b>
										option in the <b>Workspace</b> menu and then pasting the JSON
										text into the prompt.
									</li>
									<li>
										You can export the circuit diagram as an image by clicking the{" "}
										<b>Export Image</b> option in the <b>Circuit</b> menu.
									</li>
									<li>
										You can export the circuit as a CSV matrix of complex values by
										clicking the <b>Export Matrix</b> option in the <b>Circuit</b>{" "}
										menu.
									</li>
								</ul>
							</p>
							<p>
								<h3>Resizing:</h3>
								<ul>
									<li>
										You can resize your circuit by changing the <b>Qubits</b>{" "}
										setting in the <b>Circuit</b> menu.
									</li>
									<li>
										If the new size is smaller than the existing circuit, gates that
										don't fit will be removed.
									</li>
								</ul>
							</p>
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}
}
