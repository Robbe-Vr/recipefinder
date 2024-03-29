import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { TablePagination, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        marginBottom: theme.spacing(3),
        minWidth: "80%",
    },
}));

function EntityList({ rows, columns }) {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    return (
        <div>
            <TableContainer className={classes.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow>
                    {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                        >
                            {column.label}
                        </TableCell>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}
                            onClick={row.onClick ? (e) => {
                                if (e.target.name === 'optionsButton' || e.target.parentElement.name === 'optionsButton' ||
                                    e.target.attributes?.name?.value === 'optionsButton' ||
                                    e.target.parentElement?.attributes?.name?.value === 'optionsButton')
                                { e.stopPropagation(); return; }
                                
                                row.onClick(row.id);
                            }
                            : () => {}
                            }
                        >
                        {columns.map((column) => {
                            const value = row[column.id];
                            return (
                                <TableCell key={column.id} align={column.align}>
                                    {column.format ? (column.format(value)) ?? value : value}
                                </TableCell>
                            );
                        })}
                        </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            </TableContainer>
        </div>
    );
};

export { EntityList };