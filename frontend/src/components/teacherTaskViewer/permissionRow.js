import React from "react";
import { Box, TableCell, TableRow, Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

export default function PermissionRow(props) {
    let data = props.data;

    return (
        <TableRow hover onClick={() => {}}>
            <TableCell>
                <Box>
                    <Typography
                        variant="body2"
                        style={{ userSelect: "none", fontSize: "14px" }}
                    >
                        {data.name}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell>
                <IconButton hover onClick={() => {}} size="small">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}