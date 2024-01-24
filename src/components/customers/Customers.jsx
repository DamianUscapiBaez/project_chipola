import { AddCircleOutline, Close, Delete, Edit, Search } from "@mui/icons-material";
import { Button, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Config from "../../Config";
import { NewCliente } from "./NewCliente";
import Swal from "sweetalert2";

export const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchCustomer, setSearchCustomer] = useState('');
    const [customerdlg, setCustomersdlg] = useState({
        open: false,
        titledlg: '',
        idcustomer: 0
    });
    // const table
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);
    // handle table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    // functions
    const handleopencustomer = () => {
        setCustomersdlg({ open: true, titledlg: 'NUEVO CLIENTE', idcustomer: 0 });
    }
    const handleclosecustomer = () => {
        setCustomersdlg({ open: false, titledlg: '', idcustomer: 0 });
    }
    const filterCustomer = () => {
        if (searchCustomer !== "") {
            const filtercustomer = customers.filter(c => c.namecustomer.includes(searchCustomer.toUpperCase() || c.tradename.includes(searchCustomer.toUpperCase() || c.tradename.includes(documentcustomer.toUpperCase()))));
            return filtercustomer;
        } else {
            return customers;
        }
    }
    // functions api
    const listcustomer = async () => {
        const response = await fetch(`${Config.URL_BASE}/customer/listarclientes.php`);
        const data = await response.json();
        setCustomers(data);
    }
    const deletecustomer = (idcustomer) => {
        Swal.fire({
            title: 'Estas seguro de eliminar?',
            text: "Esta accion no podra ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${Config.URL_BASE}/customer/eliminarcustomer.php?idcustomer=${idcustomer}`);
                    const data = await response.json();
                    if (data.executed) {
                        Swal.fire(
                            'Eliminado!',
                            'Se completó exitosamente.',
                            'success'
                        );
                        listcustomer();
                    }
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'No se pudo eliminar.',
                        'error'
                    );
                }
            }
        })
    }
    useEffect(() => {
        listcustomer();
    }, []);
    return (
        <Grid container sx={{ justifyContent: 'center', mt: 3 }}>
            <Grid item xs={12} md={11}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>CLIENTES</Typography>
                            <Button onClick={handleopencustomer} size="small" color="success" variant="contained" startIcon={<AddCircleOutline />}>
                                NUEVO
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="BUSCAR CLIENTE"
                            fullWidth
                            margin="normal"
                            size="small"
                            inputProps={{ style: { textTransform: 'uppercase' } }}
                            value={searchCustomer}
                            onChange={(e) => setSearchCustomer(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                        <Paper>
                            <TableContainer sx={{ maxWidth: '275px', minWidth: '100%', height: '60vh' }}>
                                <Table aria-label="simple table" size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>DOC.</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>TIPO</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>RAZON SOCIAL</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>NOMBRE COMERCIAL</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>TIPO</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>P.VENTA</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>DÍAS PAGO</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }} align="right">ACCIONES</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? filterCustomer().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : filterCustomer()
                                        ).map((row) => (
                                            <TableRow
                                                key={row.idcustomer}
                                            >
                                                <TableCell style={{ fontSize: '12px' }}>{row.documentcustomer}</TableCell>
                                                <TableCell style={{ fontSize: '12px' }}>{row.typedocument}</TableCell>
                                                <TableCell style={{ fontSize: '12px' }}>{row.namecustomer}</TableCell>
                                                <TableCell style={{ fontSize: '12px' }}>{!row.tradename ? 'SIN NOMBRE COMERCIAL' : row.tradename}</TableCell>
                                                <TableCell style={{ fontSize: '12px' }}>{row.type === "V" ? 'REVENDEDOR' : 'RESTAURANTE'}</TableCell>
                                                <TableCell style={{ fontSize: '12px' }} align="right">{row.unitprice}</TableCell>
                                                <TableCell style={{ fontSize: '12px' }} align="right">{row.diaspago}</TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="EDITAR CLIENTE" placement="top">
                                                        <IconButton size="small" onClick={() => setCustomersdlg({ open: true, titledlg: "EDITAR CLIENTE", idcustomer: row.idcustomer })}>
                                                            <Edit fontSize="small" color="warning" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="ELIMINAR CLIENTE" placement="top">
                                                        <IconButton size="small" onClick={() => deletecustomer(row.idcustomer)}>
                                                            <Delete fontSize="small" color="error" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                rowsPerPageOptions={[15, 30, 45]}
                                count={filterCustomer().length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Filas por página"
                            />
                        </Paper>
                    </Grid>
                    <Dialog open={customerdlg.open} fullWidth maxWidth="sm">
                        <DialogTitle>
                            {customerdlg.titledlg}
                            <IconButton
                                aria-label="close"
                                onClick={handleclosecustomer}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <NewCliente onClose={handleclosecustomer} listarCliente={listcustomer} customerObj={customerdlg} />
                        </DialogContent>
                    </Dialog>
                </Grid>
            </Grid>
        </Grid>
    );
}