import React from "react";
import ProfileRow from "./profileRow";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import BoxedSpace from "../common/boxedSpace";

const useStyles = makeStyles((theme) => ({
	row: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	divider: {
		width: "100%",
		borderBottom: "solid 1px rgba(0, 0, 0, 0.07)",
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
					// TODO: Add some kind of spinner here to show the page is still loading
					<p>Loading profile</p>
				)}
			</Container>
		</Box>
	);
}
