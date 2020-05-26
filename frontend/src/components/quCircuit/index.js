import React, { useContext, useEffect, useRef, useState } from "react";
import { Box } from "@material-ui/core";
import { fashion } from "../../helpers/fashion";
import StretchBox from "../common/stretchBox";
import Cell from "./cell";
import GatesToolbox from "./gatesToolbox";
import Paper from "@material-ui/core/Paper";
import CircuitInputButton from "./circuitInputButton";
import Button from "@material-ui/core/Button";
import { translateToSimulator, } from "../../helpers/quantumSimulator/quantumTranslator";
import CellLife from "../../helpers/quCircuit/cellLife";
import CellData from "../../helpers/quCircuit/cellData";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { AuthContext } from "../../context/auth";
import SaveCircuitModal from "./modals/saveCircuit";
import LoadCircuitModal from "./modals/loadCircuit";
import api from "../../helpers/api";
import Toast from "../Toast/toast";
import { CircuitResultsContext, CircuitSetterContext, CircuitStructureContext } from "../../context/circuit";
import { CircuitStructure } from "../../helpers/quCircuit/circuitStructure";
import QuantumBarChart from "./quantumBarChart"
import { Grid } from "@material-ui/core";

const CircuitBox = fashion(Box, (theme) => ({
	marginTop: theme.spacing(1),
	marginLeft: theme.spacing(1),
	marginRight: theme.spacing(1),
}));

const ToolBox = fashion(Box, (theme) => ({
	backgroundColor: "#f7f7f7",
}));

const SmallBox = fashion(Box, (theme) => ({
	position: "absolute",
	width: "28pt",
}));

const PlatformBox = fashion(Box, (theme) => ({
	backgroundColor: "#EEEEEE",
	border: "solid 1px #EEEEEE",
	borderRadius: 5,
	padding: theme.spacing(2),
}));

const ResultBox = fashion(Box, (theme) => ({
	overflow: "auto",
	maxHeight: "15vh",
	maxWidth: "11vw",
}));

export default function QuCircuit(props) {
	const { authState } = useContext(AuthContext);
	const [selectedCell, setSelectedCell] = useState(null);
	const circuitRef = useRef();
	const [modalState, setModalState] = useState({ open: false });
	const [toastState, setToastState] = useState({ open: false });
	const circuitSetter = useContext(CircuitSetterContext);
	const circuitStructure = useContext(CircuitStructureContext);
    const circuitResults = useContext(CircuitResultsContext);
    console.log(circuitResults);
	const circuit = circuitStructure.internalStructure;
	const circuitInputs = circuitStructure.inputs;

	function refreshCircuit() {
		circuitSetter.setStructure(circuitStructure.copy())
	}

	useEffect(() => {
		function onMouseDown(event) {
			if (circuitRef.current && !circuitRef.current.contains(event.target)) {
				setSelectedCell(null);
			}
		}

		document.addEventListener("mousedown", onMouseDown);

		return () => {
			document.removeEventListener("mousedown", onMouseDown);
		};
	}, [circuitRef]);

	let listeners = {};

	listeners.onGateChanged = (cellLife, gate) => {
		let wireIndex = cellLife.wireIndex;
		let cellIndex = cellLife.cellIndex;
		cellLife.removeMultigates();
		cellLife.removeAllConnections();

		// Check if we are setting a new gate at the cell.
		if (gate) {
			let cellData = circuit[wireIndex][cellIndex];

			if (!cellData) {
				circuit[wireIndex][cellIndex] = new CellData(
					wireIndex,
					cellIndex,
					gate
				);
			} else {
				cellData.gate = gate;
			}

			let disturbedCell = cellLife.getDisturbedCell();

			// Connect to selected if the cell is placed in the middle of a connection.
			if (disturbedCell) {
				cellLife.createConnectionTo(disturbedCell);
			}

			// Needs to be here to have the selectedCell have an updated selectedCell.
			cellLife.selectedCell = cellLife;
			// Finally set current cell as selected cell.
			setSelectedCell(cellLife);
		} else {
			circuit[wireIndex][cellIndex] = null;
		}

		refreshCircuit();
	};

	listeners.onGateClicked = (cellLife, event) => {
		// Needs to be here to have the selectedCell have an updated selectedCell.
		cellLife.selectedCell = cellLife;
		setSelectedCell(cellLife);
	};

	listeners.onConnect = (cellLife, event) => {
		cellLife.createConnectionToSelected();

		let cellsToLook =
			cellLife.getDirectionTowards(selectedCell.wireIndex) === "up"
				? cellLife.getCellsAbove()
				: cellLife.getCellsBelow();

		for (let cell of cellsToLook) {
			if (cell.samePositionAs(selectedCell)) {
				break;
			}

			if (cell.gate) {
				cell.createConnectionToSelected();
			}
		}

		refreshCircuit();
	};

	listeners.onDisconnect = (cellLife, event) => {
		let direction = cellLife.getDirectionTowards(selectedCell.wireIndex);
		selectedCell
			.getSourceCells()
			.filter(
				(cell) =>
					(direction === "up" && cell.wireIndex >= cellLife.wireIndex) ||
					(direction === "down" && cell.wireIndex <= cellLife.wireIndex)
			)
			.forEach((cell) => cell.removeConnectionToSelected());

		refreshCircuit();
	};

	listeners.onGrowMultigate = (cellLife, wireIndex) => {
		let otherCell = cellLife.copyOfPosition(wireIndex, cellLife.cellIndex);

		otherCell.removeMultigates();
		otherCell.removeAllConnections();
		circuit[wireIndex][cellLife.cellIndex] = new CellData(
			wireIndex,
			cellLife.cellIndex,
			cellLife.gate
		);

		let finalMultigates = [
			...cellLife.cellData.multigates,
			otherCell.wireIndex
		].sort();

		cellLife
			.getMultigateCells()
			.forEach((cell) => (cell.cellData.multigates = finalMultigates));
		otherCell.cellData.multigates = finalMultigates;

		refreshCircuit();
	};

	function cells(amount, wireIndex) {
		let wireCells = new Array(amount);

		for (let cellIndex = 0; cellIndex < amount; cellIndex++) {
			let cellLife = new CellLife(
				wireIndex,
				cellIndex,
				circuit,
				selectedCell,
				listeners
			);
			wireCells[cellIndex] = <Cell key={cellIndex} cellLife={cellLife} />;
		}

		return wireCells;
	}

	function buildWires(wireAmount, cellAmount) {
		let wires = new Array(wireAmount);

		for (let wireIndex = 0; wireIndex < wireAmount; wireIndex++) {
			function onInputButtonClicked(event) {
				let inputs = circuitStructure.inputs;
				let inputIndex = CircuitStructure.AllowedCircuitInputs.indexOf(inputs[wireIndex]);
				let nextIndex = (inputIndex + 1) % CircuitStructure.AllowedCircuitInputs.length;
				inputs[wireIndex] = CircuitStructure.AllowedCircuitInputs[nextIndex];
				circuitSetter.setInputs([...inputs]);
			}

			wires[wireIndex] = (
				<Box display="flex" key={wireIndex}>
					{/*Use lowercase prop names here because for some reason react doesn't like it and throws warnings */}
					<CircuitInputButton
						circuitinputs={circuitInputs}
						wireindex={wireIndex}
						onClick={onInputButtonClicked}
					/>
					{cells(cellAmount, wireIndex)}
				</Box>
			);
		}

		return <>{wires}</>;
	}

	async function onEvaluateButtonClicked(event) {
		let res = await circuitStructure.calculateResults();
		circuitSetter.setResults(res);
	}

	function onClearCircuitClicked(event) {
		circuitSetter.clearStructure();
	}

	function onDrop(event) {
		event.preventDefault();

		let wireIndex = event.dataTransfer.getData("wireIndex");
		let cellIndex = event.dataTransfer.getData("cellIndex");

		if (wireIndex && cellIndex) {
			let cellLife = new CellLife(
				wireIndex,
				cellIndex,
				circuit,
				selectedCell,
				listeners
			);

			// Need to look into a better way to do this.
			cellLife.removeCell();
			refreshCircuit();
		}
	}

    const buildResultsComp = () => {
        /*var slice = circuitResults.slice(0);
        for (var p in slice) {
            console.log(slice[p]);
        }
        //console.log(slice);*/
		return (
			<PlatformBox m={1}>
				<h2>Circuit Results</h2>
				<ResultBox>
					{circuitResults
						.filter((r) => r.probability > 0)
						.map((e, i) => (
							<Box m={1} key={i}>
								<Typography>
									{e.amplitude}|{e.state}⟩ {e.probability}%
								</Typography>
							</Box>
						))}
				</ResultBox>
			</PlatformBox>
		);
	};

	const buildAuthenticatedOptions = () => {
		return (
			<Box>
				<Box m={1}>
					<Button
						color="primary"
						variant="contained"
						onClick={() => setModalState({ open: true, type: "saveCircuit" })}
					>
						Save Circuit
					</Button>
				</Box>
				<Box m={1}>
					<Button
						color="primary"
						variant="contained"
						onClick={() => setModalState({ open: true, type: "loadCircuit" })}
					>
						Load Circuit
					</Button>
				</Box>
			</Box>
		);
	};

	const onSaveCircuitSubmit = async (circuitId) => {
		setModalState({ open: false });
		const requestData = {
			circuitId: circuitId,
			circuitData: translateToSimulator(circuit, circuitInputs),
		};

		try {
			await api.user.circuit.create(authState.user.idToken, requestData);
			return setToastState({
				open: true,
				severity: "success",
				message: "Circuit successfully saved.",
			});
		} catch (error) {
			const { errorCode } = error.response.data;
			if (errorCode === "circuit-exists") {
				return setToastState({
					open: true,
					severity: "error",
					message: "A circuit with the provided circuit name already exists.",
				});
			}
			return setToastState({
				open: true,
				severity: "error",
				message:
					"An unknown error occurred will trying to save the users circuit.",
			});
		}
	};

	const onCircuitLoadSelect = async (circuit, action) => {
		setModalState({ open: false });
		try {
			if (action === "SELECT") {
				circuitSetter.loadStoredCircuit(circuit.circuitData);
			} else if (action === "DELETE") {
				await api.user.circuit.delete(
					authState.user.idToken,
					authState.user.uid,
					circuit.circuitId
				);
				return setToastState({
					open: true,
					severity: "success",
					message: "Circuit successfully deleted.",
				});
			}
		} catch (error) {
			const { errorCode } = error.response.data;
			return setToastState({
				open: true,
				severity: "error",
				message: `An unknown error occurred will trying to save the users circuit. (${errorCode})`,
			});
		}
	};

	const buildModal = () => {
		if (modalState.type === "saveCircuit") {
			return (
				<SaveCircuitModal
					open={modalState.open}
					onClose={() => {
						setModalState({ open: false });
					}}
					onSubmit={onSaveCircuitSubmit}
				/>
			);
		} else if (modalState.type === "loadCircuit") {
			return (
				<LoadCircuitModal
					open={modalState.open}
					onClose={() => {
						setModalState({ open: false });
					}}
					onItemSelect={onCircuitLoadSelect}
				/>
			);
		}
	};

	const buildToast = () => {
		return (
			<Toast
				severity={toastState.severity}
				message={toastState.message}
				onClose={() => setToastState({ open: false })}
			/>
		);
	};

	return (
		<StretchBox
			display="flex"
			onDrop={onDrop}
			onDragOver={(event) => event.preventDefault()}
        >
            <Grid flexGrow={1} flexShrink={6} justifyContent="flex-end" style={{ backgroundColor: "#CB31FF" }}>
			    <CircuitBox flexGrow={1} flexShrink={6}>
                    <div ref={circuitRef}>{buildWires(circuitStructure.wireCount, CircuitStructure.CellCount)}</div>
                </CircuitBox>
                <QuantumBarChart />
            </Grid>
			<ToolBox component={Paper} variant="outlined" flexGrow={1} flexShrink={1}>
				<PlatformBox m={1} display="flex">
					<Box>
						<Box m={1}>
							<Button color="primary" variant="contained" onClick={() => circuitStructure.runUserDownload()}>
								Export File
							</Button>
						</Box>

						<Box m={1}>
							<Button color="primary" variant="contained" onClick={() => circuitSetter.runUserUpload()}>
								Import File
							</Button>
						</Box>
					</Box>
					{authState.authenticated && buildAuthenticatedOptions()}
				</PlatformBox>
				<PlatformBox m={1}>
					<GatesToolbox />
				</PlatformBox>
				<PlatformBox m={1}>
					<Box m={1}>
                        <Button
                            id = "evaluateButton"
							color="primary"
							variant="contained"
							onClick={onEvaluateButtonClicked}
						>
							Evaluate
						</Button>
					</Box>
				</PlatformBox>

				<PlatformBox
					m={1}
					display="flex"
					justifyContent="space-around"
					alignContent="end"
				>
					<Box m={1}>
						<Typography>Wires</Typography>
						<SmallBox>
							<TextField
								type="number"
								value={circuitStructure.wireCount}
								onChange={(event) =>
									circuitSetter.setWireCount(event.target.value)}
							/>
						</SmallBox>
					</Box>
					<Box m={1}>
						<Button
							color="primary"
							variant="contained"
							onClick={onClearCircuitClicked}
						>
							Clear
						</Button>
					</Box>
                </PlatformBox>
				{circuitResults.length > 0 && buildResultsComp()}
			</ToolBox>
			{/* Utility components that are displayed when needed */}
			{modalState.open && buildModal()}
            {toastState.open && buildToast()}
        </StretchBox>
	);
}
