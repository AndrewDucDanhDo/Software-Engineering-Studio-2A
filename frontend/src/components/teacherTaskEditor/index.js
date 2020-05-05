import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Grid, Paper, Typography } from "@material-ui/core";
import ExpectedOutputBox from "../teacherTaskViewer/expectedOutputBox";
import QuCircuit from "../quCircuit";

export default class TeacherTaskEditor extends React.Component {

    render() {
        return (
            <Grid container style={{position: "absolute", width: "100%", height: "90%"}}>
                <Grid xs={2} item component={Paper} style={{backgroundColor: "#f7f7f7"}}>
                    <ExpectedOutputBox/>
                    <Box p={2}>
                        <Box textAlign="left">
                            <Typography variant="h6">Settings</Typography>
                        </Box>
                        <Box my={4}>
                            <Button variant="contained" color="primary">Set Output to Expected Output</Button>
                        </Box>
                        <Box my={4}>
                            <Button component={Link} to="/teacherTaskViewer" variant="contained" color="default">Back to Viewer</Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid xs={10} item>
                    <QuCircuit/>
                </Grid>
            </Grid>
        );
    }
}