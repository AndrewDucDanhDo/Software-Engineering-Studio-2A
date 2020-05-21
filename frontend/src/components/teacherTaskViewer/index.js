import React from "react";
import {Link} from "react-router-dom";
import {Box, Button, Card, Grid, Paper, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import ExpectedOutputBox from "./expectedOutputBox";
import QuantumSimulator from "../quantum";

export default class TeacherTaskViewer extends React.Component {

    submissionRow(data) {
        return (
            <TableRow hover onClick={() => {}}>
                <TableCell>
                    <Box>
                        <Typography variant="body2" style={{userSelect: "none"}}>{data.name}'s Submission</Typography>
                    </Box>
                </TableCell>
            </TableRow>
        );
    }

    expectedBox() {

    }

    extrasBox() {
        return (
            <Card variant="outlined" style={{padding: 20}}>
                <Box>
                    <Button variant="contained" component={Link} to="/teacherTasks">Back to tasks</Button>
                </Box>
            </Card>
        )
    }

    render() {
        let sampleData = [
            { name: "John" },
            { name: "David" },
            { name: "Bruce" },
            { name: "William" },
            { name: "Ned" }
        ];

        return (
            <Grid container style={{position: "absolute", width: "100%", height: "90%"}}>
                <Grid xs={2} component={Paper} item style={{backgroundColor: "#f7f7f7"}}>
                    <Box m={2}>
                        <Card variant="outlined" style={{padding: 8}}>
                            <Box textAlign="left" p={2}>
                                <Typography variant="h6">Submissions</Typography>
                            </Box>

                            <Table component={Paper} variant="outlined">
                                <TableBody>
                                    {sampleData.map((data) => this.submissionRow(data))}
                                </TableBody>
                            </Table>
                        </Card>

                        <Box my={3}>
                            <Card variant="outlined">
                                <ExpectedOutputBox editable/>
                            </Card>
                        </Box>

                        <Box my={3}>
                            {this.extrasBox()}
                        </Box>
                    </Box>
                </Grid>

                <Grid xs={10} item>
                    <QuantumSimulator/>
                </Grid>
            </Grid>
        );
    }
}