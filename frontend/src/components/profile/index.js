import React from "react"
import ProfileRow from "./profileRow";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import BoxedSpace from "../common/boxedSpace";

const useStyles = makeStyles((theme) => ({
    row: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    divider: {
        width: "100%",
        borderBottom: "solid 1px rgba(0, 0, 0, 0.07)"
    },
}));

export default function Profile () {
    const classes = useStyles();

    function fetchProfile() {
        // TODO: Get profile data from the backend here.
    }

    let divider = (<Box className={classes.divider}/>);

    return (
        <Box m={3}>
            <Container maxWidth="md">

                <Box textAlign="left" ml={3} my={1}>
                    <Typography variant="h4">Profile</Typography>
                </Box>

                <BoxedSpace>
                    <ProfileRow className={classes.row} title="Name" value="Sample gazooie" editable/>
                    {divider}
                    <ProfileRow className={classes.row} title="Student ID" value="121341"/>
                    {divider}
                    <ProfileRow className={classes.row} title="Email" value="sample@gmail.com" editable/>
                </BoxedSpace>
            </Container>
        </Box>
    );
}