import React from "react"
import {Box, Container, Paper, Table, TableBody, Typography} from "@material-ui/core";
import ProfileRow from "./profileRow";

export default class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    fetchProfile() {
        // TODO: Get profile data from the backend here.
    }

    render() {
        return (
            <Box m={3}>
                <Container maxWidth="md">
                    <Typography variant="h4">
                        <Box  my={2} ml={2} textAlign="left">Profile</Box>
                    </Typography>

                    <Table component={Paper} style={{tableLayout: "fixed"}}>
                        <colgroup>
                            <col style={{width: "22%"}}/>
                            <col style={{width: "55%"}}/>
                            <col style={{width: "25%"}}/>
                        </colgroup>
                        <TableBody>
                            <ProfileRow title="Name" value="Sample gazooie" editable/>
                            <ProfileRow title="Student ID" value="121341"/>
                            <ProfileRow title="Email" value="sample@gmail.com" editable/>
                        </TableBody>
                    </Table>
                </Container>
            </Box>
        )
    }
}