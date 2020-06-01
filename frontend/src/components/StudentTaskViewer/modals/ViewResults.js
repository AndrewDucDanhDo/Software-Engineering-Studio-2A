import React from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
	DialogContent,
	Dialog,
	DialogActions,
	makeStyles,
	Typography,
	Container,
	Box,
} from "@material-ui/core";

const withStyles = makeStyles({
	fieldBox: {
		padding: 2,
	},
	fieldHeading: {
		fontSize: 20,
	},
	modalHeading: {
		fontSize: 25,
	},
});

export default function ViewResultsModal(props) {
	const { onClose, open, submissionData } = props;
	const { results } = submissionData;
	const classes = withStyles();

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			open={open}
		>
			<DialogTitle id="simple-dialog-title">
				<Typography variant="h6" className={classes.modalHeading}>
					Submission Results
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Container>
					<Box className={classes.fieldBox}>
						<Typography variant="h6" className={classes.fieldHeading}>
							Status
						</Typography>
						<Typography variant="body1">{results.status}</Typography>
					</Box>
					<Box className={classes.fieldBox}>
						<Typography variant="h6" className={classes.fieldHeading}>
							Submission Mark
						</Typography>
						<Typography variant="body1">
							{results.submissionMark} / {results.totalMarks}
						</Typography>
					</Box>
					<Box className={classes.fieldBox}>
						<Typography variant="h6" className={classes.fieldHeading}>
							Comment
						</Typography>
						<Typography variant="body1">{results.comment}</Typography>
					</Box>
				</Container>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
