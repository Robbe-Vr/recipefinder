import React from "react";

import { makeStyles } from "@material-ui/core";
import { TablePagination, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        marginBottom: theme.spacing(3),
    },
}));

function KitchenList({ rows, columns }) {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
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
            <Table stickyHeader aria-label="sticky table">
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
                        <TableRow hover role="checkbox" tabIndex={-1} key={row[0].id}>
                        {columns.map((column) => {
                            const value = row[0][column.id];
                            return (
                                <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number' ? column.format(value) :
                                    column.id === 'units' ?
                                    <div>
                                        {(() => {
                                            var val = null;
                                            if (row[0].editComponent) {
                                                return row[0].editComponent;
                                            }
                                            if (row[0].removeComponent) {
                                                return row[0].removeComponent;
                                            }
                                            return val;
                                        })()}
                                    </div> : value
                                }
                                </TableCell>
                            );
                        })}
                        </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    );
};

export { KitchenList };