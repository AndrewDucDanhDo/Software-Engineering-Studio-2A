import React from "react";
import { Box, Button, Card, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/Delete";

export default function ExtrasBox(props) {
    return (
        <Card variant="outlined" style={{ padding: 20 }}>
            <Box textAlign="center">
                <Button
                    variant="contained"
                    style={{ fontSize: "10px" }}
                    size="small"
                    component={Link}
                    to="/teacherTasks"
                >
                    Back to tasks
                </Button>
            </Box>

            <Grid className="d-flex">
                <Box mt={2} textAlign="center">
                    <Box mr={1} display="inline">
                        <Button
                            onClick={() => {
                                console.log("onClick");
                            }}
                            variant="contained"
                            color="primary"
                            style={{ fontSize: "10px" }}
                            size="small"
                            startIcon={<SaveIcon />}
                        >
                            Save
                        </Button>
                    </Box>

                    <Box ml={0} display="inline">
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ fontSize: "10px" }}
                            size="small"
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Card>
    );
}