import React from "react";
import ProfileRow from "./profileRow";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import BoxedSpace from "../common/boxedSpace";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	row: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	divider: {
		width: "100%",
		borderBottom: "solid 1px rgba(0, 0, 0, 0.07)",
	},
	spinner: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	},
}));

export default function Profile(props) {
	const classes = useStyles();
	const { userData } = props;

	const divider = <Box className={classes.divider} />;

	return (
		<Box m={3}>
			<Container maxWidth="md">
				<Box textAlign="left" ml={3} my={1}>
					<Typography variant="h4">Profile</Typography>
				</Box>

				{userData ? (
					<BoxedSpace>
						<ProfileRow
							className={classes.row}
							title="Name"
							userData={userData}
							value="displayName"
							editable
						/>
						{divider}
						<ProfileRow
							className={classes.row}
							title="Email"
							userData={userData}
							value="email"
							editable
						/>
					</BoxedSpace>
				) : (
					<CircularProgress className={classes.spinner} />
				)}
			</Container>
		</Box>
	);
}
