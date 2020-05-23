import React from "react";
import {
    Box, Card, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Paper, Table, TableBody, TableCell,
    TableHead, TableRow, TextField, Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PermissionRow from "./permissionRow";
import SubmissionRow from "./submissionRow";
import ExpectedOutputBox from "./expectedOutputBox";
import ExtrasBox from "./extrasBox";

export default function TaskSettings(props) {
    let sampleTeacherData = [
        { name: "John" },
        { name: "David" },
        { name: "Bruce" },
        { name: "William" },
        { name: "Ned" },
    ];

    let sampleSubmissionData = [
        { name: "John" },
        { name: "David" },
        { name: "Bruce" },
        { name: "William" },
        { name: "Ned" },
    ];

    return (
        <Grid
            xs={2}
            component={Paper}
            item
            style={{
                backgroundColor: "#f7f7f7",
                height: "93.5%",
                overflow: "scroll",
            }}
        >
            <Box m={1}>
                <ExpansionPanel style={{ height: "50%" }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h6">Task Overview</Typography>
                    </ExpansionPanelSummary>

                    <ExpansionPanelDetails>
                        <Box textAlign="center">
                            <TextField
                                id="name"
                                label="Name"
                                variant="outlined"
                                size="small"
                                margin="dense"
                                fullWidth
                            />

                            <TextField
                                id="desc"
                                label="Description"
                                variant="outlined"
                                size="small"
                                margin="dense"
                                multiline
                                rows={8}
                                fullWidth
                            />
                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Box>

            <Box m={1}>
                <ExpansionPanel style={{ height: "50%" }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h6">Permissions</Typography>
                    </ExpansionPanelSummary>

                    <Box mx={3}>
                        <TextField
                            id="Search"
                            label="Search"
                            type="search"
                            variant="filled"
                            size="small"
                            margin="dense"
                        />
                    </Box>

                    <ExpansionPanelDetails>
                        <Box mx={1}>
                            <Table
                                component={Paper}
                                variant="scrollable"
                                size="small"
                                style={{ overflow: "style" }}
                            >
                                <TableHead>
                                    <TableRow color="primary">
                                        <TableCell>Teachers</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sampleTeacherData.map((data) =>
                                        (<PermissionRow data={data}/>)
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Box>

            <Box m={1}>
                <ExpansionPanel style={{ height: "50%" }}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h6">Assign Task</Typography>
                    </ExpansionPanelSummary>

                    <Box mx={3} textAlign="center">
                        <TextField
                            id="Search"
                            label="Search"
                            type="search"
                            variant="filled"
                            size="small"
                            margin="dense"
                        />
                    </Box>

                    <ExpansionPanelDetails>
                        <Table component={Paper} variant="scrollable" size="small">
                            <Box textAlign="center">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Students</TableCell>
                                        <TableCell>Submission</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {sampleSubmissionData.map((data) =>
                                        (<SubmissionRow data={data}/>)
                                    )}
                                </TableBody>
                            </Box>
                        </Table>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <Box my={1}>
                    <Card variant="outlined" style={{ padding: 8 }}>
                        <ExpectedOutputBox editable />
                    </Card>
                </Box>

                <Box my={1}>
                    <ExtrasBox/>
                </Box>
            </Box>
        </Grid>
    );
}