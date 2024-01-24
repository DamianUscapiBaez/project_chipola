import { AddCircleOutline, Block, Close, Edit, FilterAlt, FilterAltOff, Search } from "@mui/icons-material";
import { Autocomplete, Button, Chip, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import Swal from "sweetalert2";
import { PDFViewer } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { NewDocuments } from "./NewDocuments";
// import { RegistrosFechasPdf } from "../reportes/RegistrosFechasPdf";
import { RegistrosClientes } from "../reportes/RegistrosClientes";
import { RegistroPdf } from "../reportes/RegistroPdf";

export const Boletas = () => {
    const years = Array.from({ length: new Date().getFullYear() - 2018 }, (_, index) => 2019 + index);
    var fecha = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    // const app
    const [boletas, setBoletas] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [dialogPdfYear, setDialogPdfYear] = useState({
        open: false,
        titulo: ""
    });
    // const [dialogPdfFecha, setDialogPDfFecha] = useState(false);
    const [buttonValue, setButtonValue] = useState(null);
    const [registrosPdf, setRegistrosPdf] = useState([]);
    const [boletasFechasPdf, setBoletasFechasPdf] = useState([]);
    // const table
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);
    // const dialog
    const [searchRegister, setSearchRegister] = useState({
        idcustomer: 0,
        numero: '',
        status: 'ALL',
        typedocument: 'B',
        year: new Date().getFullYear()
    });
    const [documentDlg, setDocumentDlg] = useState({
        show: false,
        title: "",
        idregistro: 0,
    });
    const [boletasFechas, setBoletasFechas] = useState({
        idcustomer: 0,
        numero: '',
        fechainicio: fecha,
        fechafinal: fecha,
        status: 'ALL',
        typedocument: 'B'
    });
    // handle table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    // handles
    const handleCloseDocumentDlg = () => {
        setDocumentDlg({ show: false, title: '', idregistro: 0 });
    }
    const handlebutton = (e, value) => {
        setButtonValue(value);
        listarBoletas();
    }
    const handleOpenDocumentDlg = () => {
        setDocumentDlg({ show: true, title: 'NUEVA FACTURA / BOLETA', idregistro: 0 });
    }
    const handleAutocompletaFechas = (e, values) => {
        if (values !== null) {
            setBoletasFechas({ ...boletasFechas, idcustomer: values.idcustomer });
        } else {
            setBoletasFechas({ ...boletasFechas, idcustomer: 0 });
        }
    }
    const handleBoletasFechas = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'numero':
                setBoletasFechas({ ...boletasFechas, [name]: value.replace(/\s/g, '') });
                break;
            default:
                setBoletasFechas({ ...boletasFechas, [name]: value });
                break;
        }
    }
    // handle form
    const handleSearch = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'numero':
                setSearchRegister({ ...searchRegister, [name]: value.replace(/\s/g, '') });
                break;
            default:
                setSearchRegister({ ...searchRegister, [name]: value });
                break;
        }
    }
    const handleAutocompleta = (e, values) => {
        if (values !== null) {
            setSearchRegister({ ...searchRegister, idcustomer: values.idcustomer });
        } else {
            setSearchRegister({ ...searchRegister, idcustomer: 0 });
        }
    }
    // funciotns apis
    const deleteBoleta = (iddocument) => {
        Swal.fire({
            title: 'Estas seguro de anular la boleta?',
            text: "Esta accion no podra ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, anular!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${Config.URL_BASE}/register/eliminarRegister.php?iddocument=${iddocument}`);
                const data = await response.json();
                if (data.executed) {
                    Swal.fire(
                        'Boleta Anulada!',
                        'Se completo exitosamente.',
                        'success'
                    );
                }
                listarBoletas();
            }
        });
    }
    // functions
    const buscarRegistro = async () => {
        const { idcustomer, numero, status, typedocument, year } = searchRegister;
        const response = await fetch(`${Config.URL_BASE}/register/registersearch.php?idcustomer=${idcustomer}&numero=${numero}&status=${status}&&typedocument=${typedocument}&&year=${year}`);
        const data = await response.json();
        setBoletas(data);
        setPage(0);
    }
    // functions apis
    const listarBoletas = async () => {
        const response = await fetch(`${Config.URL_BASE}/register/listarregisterB.php`);
        const data = await response.json();
        setBoletas(data);
    }
    const obtenerDatosFechas = async () => {
        const { fechainicio, fechafinal, numero, status, idcustomer, typedocument } = boletasFechas;
        if (fechainicio && fechafinal) {
            if (fechainicio <= fechafinal && fechafinal >= fechainicio) {
                const response = await fetch(`${Config.URL_BASE}/reportes/listarregistrosfechas.php?fechainicio=${fechainicio}&fechafinal=${fechafinal}&numero=${numero}&idcustomer=${idcustomer}&status=${status}&type=${typedocument}`);
                const data = await response.json();
                if (data.length > 0) {
                    setDialogPdfYear({ open: true, titulo: ` DESDE ${fechainicio.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')} AL ${fechafinal.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}` });
                    setRegistrosPdf(data);
                    setBoletasFechasPdf([]);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No hay datos disponibles para las fechas seleccionadas',
                    });
                }
            } else if (fechainicio > fechafinal) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La fecha inicio no puede ser mayor a la fecha final',
                });
            } else if (fechafinal < fechainicio) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La fecha final no puede ser menor a la fecha inicio',
                });
            }
        }
    }
    const obtenerDatosRegistroPdf = async () => {
        const { idcustomer, numero, status, typedocument, year } = searchRegister;
        if (idcustomer > 0) {
            const response = await fetch(`${Config.URL_BASE}/register/registersearch.php?idcustomer=${idcustomer}&numero=${numero}&status=${status}&&typedocument=${typedocument}&&year=${year}`);
            const data = await response.json();
            if (data.length > 0) {
                setDialogPdfYear({ open: true, titulo: year });
                setBoletasFechasPdf(data);
                setRegistrosPdf([]);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'No hay datos',
                    text: 'No se encontraron facturas disponibles para exportar.',
                });
            }
        } else {
            const responseGuias = await fetch(`${Config.URL_BASE}/reportes/listarregistrosclientes.php?idcustomer=${idcustomer}&estado=${status}&year=${year}&typedocument=${typedocument}`);
            const data = await responseGuias.json();
            if (data.length > 0) {
                setDialogPdfYear({ open: true, titulo: year });
                setRegistrosPdf(data);
                setBoletasFechasPdf([]);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'No hay datos',
                    text: 'No se encontraron boletas disponibles para exportar.',
                });
            }
        }
    };
    const buscarBoletasFechas = async () => {
        const { fechainicio, fechafinal, numero, status, idcustomer, typedocument } = boletasFechas;
        if (fechainicio && fechafinal) {
            if (fechainicio <= fechafinal && fechafinal >= fechainicio) {
                const response = await fetch(`${Config.URL_BASE}/reportes/listarregistrosfechas.php?fechainicio=${fechainicio}&fechafinal=${fechafinal}&numero=${numero}&idcustomer=${idcustomer}&status=${status}&type=${typedocument}`);
                const data = await response.json();
                setBoletas(data);
                setPage(0);
            } else if (fechainicio > fechafinal) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La fecha inicio no puede ser mayor a la fecha final',
                });
            } else if (fechafinal < fechainicio) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La fecha final no puede ser menor a la fecha inicio',
                });
            }
        }
    }
    // useEffect
    useEffect(() => {
        const listarClientes = async () => {
            const response = await fetch(`${Config.URL_BASE}/customer/listarclientes.php`, {
                method: 'GET'
            });
            const data = await response.json();
            setCustomers(data);
        }
        listarBoletas();
        listarClientes();
    }, []);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Stack direction={{ md: 'row', xs: 'column' }} justifyContent={'space-between'}>
                    <ToggleButtonGroup
                        value={buttonValue}
                        exclusive
                        onChange={handlebutton}
                        aria-label="Platform"
                        color="success"
                    >
                        <ToggleButton value="Y">
                            {buttonValue === "Y" ? <FilterAltOff /> : <FilterAlt />}
                            FILTRO POR AÑO
                        </ToggleButton>
                        <ToggleButton value="F">
                            {buttonValue === "F" ? <FilterAltOff /> : <FilterAlt />}
                            FILTRO POR FECHAS
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Button sx={{ width: '100px', height: '40px', mt: { xs: 2, md: 0 } }} variant="contained" fullWidth color="success" startIcon={<AddCircleOutline />} onClick={handleOpenDocumentDlg}>NUEVO</Button>
                </Stack>
            </Grid>
            {
                buttonValue === "Y" &&
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    id="list-customer"
                                    onChange={handleAutocompleta}
                                    options={customers}
                                    value={customers.find((cliente) => cliente.idcustomer === searchRegister.idcustomer) || null}
                                    getOptionLabel={(option) => option.tradename}
                                    renderInput={(params) => (
                                        <TextField {...params} label="CLIENTE" size="small" />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="NUMERO"
                                    fullWidth
                                    size="small"
                                    name="numero"
                                    value={searchRegister.numero}
                                    onChange={handleSearch}
                                    inputProps={{
                                        style: { textTransform: 'uppercase' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={1}>
                                <FormControl fullWidth>
                                    <InputLabel>AÑO</InputLabel>
                                    <Select
                                        size="small"
                                        value={searchRegister.year}
                                        label="AÑO"
                                        name="year"
                                        onChange={handleSearch}
                                    >
                                        {years.map((year) => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>ESTADO</InputLabel>
                                    <Select
                                        size="small"
                                        value={searchRegister.status}
                                        label="ESTADO"
                                        name="status"
                                        onChange={handleSearch}
                                    >
                                        <MenuItem value="ALL">TODO</MenuItem>
                                        <MenuItem value="ANU">ANULADO</MenuItem>
                                        <MenuItem value="PEN">PENDIENTE</MenuItem>
                                        <MenuItem value="PAG">PAGADO</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3} md={1}>
                                <Button fullWidth variant="contained" color="warning" startIcon={<Search />} onClick={buscarRegistro}>BUSCAR</Button>
                            </Grid>
                            <Grid item xs={6} sm={3} md={1}>
                                <Button fullWidth color="error" variant="contained" onClick={obtenerDatosRegistroPdf} startIcon={<FontAwesomeIcon icon={faFilePdf} />}>
                                    PDF
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            }
            {
                buttonValue === "F" &&
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                    id="list-customer"
                                    onChange={handleAutocompletaFechas}
                                    options={customers}
                                    value={customers.find((cliente) => cliente.idcustomer === boletasFechas.idcustomer) || null}
                                    getOptionLabel={(option) => option.tradename}
                                    renderInput={(params) => (
                                        <TextField {...params} label="CLIENTE" size="small" />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <TextField
                                    label="NUMERO"
                                    fullWidth
                                    size="small"
                                    name="numero"
                                    value={boletasFechas.numero}
                                    onChange={handleBoletasFechas}
                                    inputProps={{
                                        style: { textTransform: 'uppercase' }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <TextField
                                    label="FECHA INICIO"
                                    type="date"
                                    size="small"
                                    fullWidth
                                    name="fechainicio"
                                    value={boletasFechas.fechainicio}
                                    onChange={handleBoletasFechas}
                                    error={!boletasFechas.fechainicio}
                                    helperText={!boletasFechas.fechainicio ? 'Fecha inicio es obligatorio' : ''}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <TextField
                                    label="FECHA FINAL"
                                    type="date"
                                    size="small"
                                    fullWidth
                                    name="fechafinal"
                                    value={boletasFechas.fechafinal}
                                    onChange={handleBoletasFechas}
                                    error={!boletasFechas.fechafinal}
                                    helperText={!boletasFechas.fechafinal ? 'Fecha final es obligatorio' : ''}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={6} sm={4} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>ESTADO</InputLabel>
                                    <Select
                                        size="small"
                                        value={boletasFechas.status}
                                        label="ESTADO"
                                        name="status"
                                        onChange={handleBoletasFechas}
                                    >
                                        <MenuItem value="ALL">TODO</MenuItem>
                                        <MenuItem value="ANU">ANULADO</MenuItem>
                                        <MenuItem value="PEN">PENDIENTE</MenuItem>
                                        <MenuItem value="PAG">PAGADO</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sm={3} md={1}>
                                <Button fullWidth variant="contained" color="warning" startIcon={<Search />} onClick={buscarBoletasFechas}>BUSCAR</Button>
                            </Grid>
                            <Grid item xs={6} sm={3} md={1}>
                                <Button fullWidth color="error" variant="contained" onClick={obtenerDatosFechas} startIcon={<FontAwesomeIcon icon={faFilePdf} />}>
                                    PDF
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            }
            <Grid item xs={12}>
                <Paper>
                    <TableContainer sx={{ maxWidth: '275px', minWidth: '100%', height: buttonValue === null ? '60vh' : '50vh' }}>
                        <Table aria-label="simple table" size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>NUMERO</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>FECHA</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>CLIENTE</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>MONTO</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>DETRACCION</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>PAGADO</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>DEUDA</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>ESTADO</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>ACCIONES</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {boletas.length === 0 ?
                                    (<TableRow>
                                        <TableCell colSpan={9} align="center">NO HAY REGISTROS DISPONIBLES</TableCell>
                                    </TableRow>)
                                    :
                                    (rowsPerPage > 0
                                        ? boletas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : boletas
                                    ).map((row) => (
                                        <TableRow
                                            key={row.iddocument}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" sx={{ fontSize: '12px' }}>
                                                {row.numero}
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ fontSize: '12px' }}>
                                                {row.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{row.cliente}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{row.monto}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{row.detraccion}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{row.montopago}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{row.deuda}</TableCell>
                                            <TableCell>
                                                {
                                                    row.estado === "PAG" && <Chip sx={{ width: '100px' }} color="success" label="PAGADO" />
                                                }
                                                {
                                                    row.estado === "PEN" && <Chip sx={{ width: '100px' }} color="warning" label="PENDIENTE" />
                                                }
                                                {
                                                    row.estado === "ANU" && <Chip sx={{ width: '100px' }} color="error" label="ANULADO" />
                                                }
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="EDITAR BOLETA" placement="top">
                                                    <IconButton size="small" onClick={() => setDocumentDlg({ show: true, title: "EDITAR FACTURA / BOLETA", idregistro: row.iddocument })}>
                                                        <Edit fontSize="small" color="warning" />
                                                    </IconButton>
                                                </Tooltip>
                                                {
                                                    row.estado !== "ANU" &&
                                                    <Tooltip title="ANULAR BOLETA" placement="top">
                                                        <IconButton size="small" onClick={() => deleteBoleta(row.iddocument)}>
                                                            <Block fontSize="small" color="error" />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[15, 25, 50]}
                        count={boletas.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                    />
                </Paper>
            </Grid>
            <Dialog open={documentDlg.show} fullWidth maxWidth="md">
                <DialogTitle>
                    {documentDlg.title}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDocumentDlg}
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
                    <NewDocuments
                        onCloseDlg={handleCloseDocumentDlg}
                        listarDocuments={listarBoletas}
                        documentDlg={documentDlg}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={dialogPdfYear.open} fullWidth maxWidth="lg">
                <DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setDialogPdfYear({ open: false, titulo: "" })}
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
                    <Grid item xs={12} sx={{ p: 2 }}>
                        <PDFViewer style={{ height: '600px', width: '100%' }}>
                            {
                                boletasFechasPdf.length > 0 &&
                                <RegistroPdf data={boletasFechasPdf} searchRegister={searchRegister} />
                            }
                            {
                                registrosPdf.length > 0 &&
                                <RegistrosClientes data={registrosPdf} clientes={customers} searchRegister={searchRegister} dialogPdfYear={dialogPdfYear} />
                            }
                        </PDFViewer>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid >
    );
}