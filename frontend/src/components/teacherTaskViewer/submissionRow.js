import React from "react";
import { Box, TableCell, TableRow, Typography } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";

export default function SubmissionRow(props) {
    let data = props.data;

    return (
        <TableRow hover onClick={() => {}}>
            <TableCell style={{ width: "30%" }}>
                <Box>
                    <Typography
                        variant="body2"
                        style={{ userSelect: "none", fontSize: "14px" }}
                    >
                        {data.name}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="center" style={{ width: "50%" }}>
                <RemoveCircleOutlineIcon
                    color="secondary"
                    style={{ width: 20, height: 20 }}
                />
            </TableCell>
        </TableRow>
    );
}