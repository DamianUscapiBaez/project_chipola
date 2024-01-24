import { Autocomplete, Button, Chip, Container, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import { AddCircleOutline, Block, Close, Edit, FilterAlt, FilterAltOff, Search } from "@mui/icons-material";
import { NewGuia } from "./NewGuia";
import Swal from "sweetalert2";
import { PDFViewer } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GuiaPdf } from "../reportes/GuiaPdf";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { GuiaFechas } from "../reportes/GuiaFechas";

export const Guias = () => {
    var fecha = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    const years = Array.from({ length: new Date().getFullYear() - 2018 }, (_, index) => 2019 + index);
    // const table
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);
    // const app
    const [guias, setGuias] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [searchGuia, setSearchGuia] = useState({
        idcustomer: 0,
        nroguia: '',
        status: 'ALL',
        year: new Date().getFullYear()
    });
    const [searchFechas, setSearchFechas] = useState({
        idcustomer: 0,
        nroguia: '',
        status: 'ALL',
        fechainicio: fecha,
        fechafinal: fecha
    });
    const [dialogPdfYear, setDialogPdfYear] = useState(false);
    const [dialogPdfFecha, setDialogPdfFecha] = useState(false);
    const [guiasPdf, setGuiasPdf] = useState([]);
    // const dialog
    const [dlgGuia, setDlgGuia] = useState({
        open: false,
        titledlg: "",
        idguia: 0
    });
    const [buttonValue, setButtonValue] = useState('');
    const [datosFechas, setDatosFechas] = useState([]);
    const handlebutton = (e, value) => {
        listguia();
        setButtonValue(value);
    }
    // handle table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    // handles 
    const handleguia = () => {
        setDlgGuia({ open: true, titledlg: "NUEVA GUIA" });
    }
    const handlecloseguia = () => {
        setDlgGuia({ open: false, titledlg: "" });
    }
    const handleSearch = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'nroguia':
                setSearchGuia({ ...searchGuia, [name]: value.replace(/\s/g, '') });
                break;
            default:
                setSearchGuia({ ...searchGuia, [name]: value });
                break;
        }
    }
    const handleAutocomplete = (e, values) => {
        if (values !== null) {
            setSearchGuia({ ...searchGuia, idcustomer: values.idcustomer });
        } else {
            setSearchGuia({ ...searchGuia, idcustomer: 0 });
        }
    }
    const handleAutocompleteFechas = (e, values) => {
        if (values !== null) {
            setSearchFechas({ ...searchFechas, idcustomer: values.idcustomer });
        } else {
            setSearchFechas({ ...searchFechas, idcustomer: 0 });
        }
    }
    const handleBusqueda = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'nroguia':
                setSearchFechas({ ...searchFechas, [name]: value.replace(/\s/g, '') });
                break;
            default:
                setSearchFechas({ ...searchFechas, [name]: value });
                break;
        }
    }
    // funcions apis
    const listguia = async () => {
        const response = await fetch(`${Config.URL_BASE}/guide/listarguide.php`, {
            method: 'GET'
        });
        const data = await response.json();
        setGuias(data);
    }
    const buscarRegistro = async () => {
        const { status, idcustomer, nroguia, year } = searchGuia;
        const response = await fetch(`${Config.URL_BASE}/guide/guiasearch.php?idcustomer=${idcustomer}&nroguia=${nroguia}&status=${status}&year=${year}`);
        const data = await response.json();
        setGuias(data);
        setPage(0);
    }
    const buscarGuiasFechas = async () => {
        const { status, idcustomer, nroguia, fechainicio, fechafinal } = searchFechas;
        if (fechainicio && fechafinal) {
            if (fechainicio <= fechafinal && fechafinal >= fechainicio) {
                const response = await fetch(`${Config.URL_BASE}/guide/guiasearchfechas.php?idcustomer=${idcustomer}&nroguia=${nroguia}&status=${status}&fechainicio=${fechainicio}&fechafinal=${fechafinal}`);
                const data = await response.json();
                setGuias(data);
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
    const obtenerDatosPdf = async () => {
        const { status, idcustomer, nroguia, year } = searchGuia;
        const response = await fetch(`${Config.URL_BASE}/guide/guiasearch.php?idcustomer=${idcustomer}&nroguia=${nroguia}&status=${status}&year=${year}`);
        const data = await response.json();
        if (data.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'No hay datos',
                text: 'No se encontraron guias disponibles para exportar.',
            });
            return;
        } else {
            setDialogPdfYear(true);
            setGuiasPdf(data);
        }
    }
    const obtenerDatosPdfFechas = async () => {
        const { status, idcustomer, nroguia, fechainicio, fechafinal } = searchFechas;
        if (fechainicio && fechafinal) {
            if (fechainicio <= fechafinal && fechafinal >= fechainicio) {
                const response = await fetch(`${Config.URL_BASE}/guide/guiasearchfechas.php?idcustomer=${idcustomer}&nroguia=${nroguia}&status=${status}&fechainicio=${fechainicio}&fechafinal=${fechafinal}`);
                const data = await response.json();
                if (data.length > 0) {
                    setDatosFechas(data);
                    setDialogPdfFecha(true);
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
    const deleteguia = (guia) => {
        Swal.fire({
            title: 'Estas seguro de anular la guia ' + guia.nroguia + '?',
            text: "Esta accion no podra ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, anular!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${Config.URL_BASE}/guide/eliminarguide.php?idguia=${guia.idguia}`);
                const data = await response.json();
                if (data.executed) {
                    Swal.fire(
                        'GUIA ANULADA' + guia.nroguia + '!',
                        'Se completo exitosamente.',
                        'success'
                    )
                    listguia();
                } else {
                    Swal.fire(
                        'Error!',
                        'No se pudo anular.',
                        'error'
                    )
                }
            }
        })
    }
    // effect
    useEffect(() => {
        const listarClientes = async () => {
            const response = await fetch(`${Config.URL_BASE}/customer/listarclientes.php`, {
                method: 'GET'
            });
            const data = await response.json();
            setCustomers(data);
        }
        listarClientes();
        listguia();
    }, []);
    return (
        <Grid container sx={{ justifyContent: 'center' }}>
            <Grid item xs={11} md={11} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack direction={'row'} justifyContent={"space-between"}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>GUIAS</Typography>
                            <Button onClick={handleguia} size="small" color="success" variant="contained" startIcon={<AddCircleOutline />}>
                                NUEVO
                            </Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <ToggleButtonGroup
                            color="primary"
                            value={buttonValue}
                            exclusive
                            onChange={handlebutton}
                            aria-label="Platform"
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
                    </Grid>
                    {
                        buttonValue === "Y" &&
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Autocomplete
                                            id="list-customer"
                                            onChange={handleAutocomplete}
                                            options={customers}
                                            value={customers.find((cliente) => cliente.idcustomer === searchGuia.idcustomer) || null}
                                            getOptionLabel={(option) => option.tradename}
                                            renderInput={(params) => <TextField {...params} label="CLIENTE" size="small" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            label="NRO GUIA"
                                            fullWidth
                                            size="small"
                                            name="nroguia"
                                            value={searchGuia.nroguia}
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
                                                value={searchGuia.year}
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
                                                value={searchGuia.status}
                                                label="ESTADO"
                                                name="status"
                                                onChange={handleSearch}
                                            >
                                                <MenuItem value="ALL">TODO</MenuItem>
                                                <MenuItem value="ANU">ANULADO</MenuItem>
                                                <MenuItem value="ATEN">ATENDIDO</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sm={3} md={1}>
                                        <Button fullWidth variant="contained" color="warning" startIcon={<Search />} onClick={buscarRegistro}>BUSCAR</Button>
                                    </Grid>
                                    <Grid item xs={6} sm={3} md={1}>
                                        <Button fullWidth color="error" disabled={searchGuia.status === "ALL"} variant="contained" onClick={obtenerDatosPdf} startIcon={<FontAwesomeIcon icon={faFilePdf} />}>
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
                            <Paper sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Autocomplete
                                            id="list-customer"
                                            onChange={handleAutocompleteFechas}
                                            options={customers}
                                            value={customers.find((cliente) => cliente.idcustomer === searchFechas.idcustomer) || null}
                                            getOptionLabel={(option) => option.tradename}
                                            renderInput={(params) => <TextField {...params} label="CLIENTE" size="small" />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <TextField
                                            label="NRO GUIA"
                                            fullWidth
                                            size="small"
                                            name="nroguia"
                                            value={searchFechas.nroguia}
                                            onChange={handleBusqueda}
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
                                            value={searchFechas.fechainicio}
                                            onChange={handleBusqueda}
                                            error={!searchFechas.fechainicio}
                                            helperText={!searchFechas.fechainicio ? 'Fecha inicio es obligatorio' : ''}
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
                                            value={searchFechas.fechafinal}
                                            onChange={handleBusqueda}
                                            error={!searchFechas.fechafinal}
                                            helperText={!searchFechas.fechafinal ? 'Fecha final es obligatorio' : ''}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={2}>
                                        <FormControl fullWidth>
                                            <InputLabel>ESTADO</InputLabel>
                                            <Select
                                                size="small"
                                                value={searchFechas.status}
                                                label="ESTADO"
                                                name="status"
                                                onChange={handleBusqueda}
                                            >
                                                <MenuItem value="ALL">TODO</MenuItem>
                                                <MenuItem value="ANU">ANULADO</MenuItem>
                                                <MenuItem value="ATEN">ATENDIDO</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sm={3} md={1}>
                                        <Button fullWidth variant="contained" color="warning" startIcon={<Search />} onClick={buscarGuiasFechas}>BUSCAR</Button>
                                    </Grid>
                                    <Grid item xs={6} sm={3} md={1}>
                                        <Button fullWidth color="error" variant="contained" onClick={obtenerDatosPdfFechas} startIcon={<FontAwesomeIcon icon={faFilePdf} />}>
                                            PDF
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <Paper>
                            <TableContainer sx={{ maxWidth: '275px', minWidth: '100%', height: !buttonValue ? '65vh' : '52vh' }}>
                                <Table aria-label="simple table" size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>NRO GUIA</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>FACTURA / BOLETA</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>FECHA</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>CLIENTE</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>KILOS</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>ESTADO</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>ACCIONES</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {guias.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">NO HAY REGISTROS DISPONIBLES</TableCell>
                                            </TableRow>
                                        )
                                            : (rowsPerPage > 0
                                                ? guias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                : guias
                                            ).map((row) => (
                                                <TableRow
                                                    key={row.idguia}
                                                >
                                                    <TableCell sx={{ fontSize: '12px' }}>
                                                        {row.nroguia ? row.nroguia : 'SIN GUIA'}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px' }}>
                                                        {row.numero ? row.numero : 'SIN DOCUMENTO'}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px' }}>{row.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</TableCell>
                                                    <TableCell sx={{ fontSize: '12px' }}>{row.namecustomer}</TableCell>
                                                    <TableCell sx={{ fontSize: '12px' }} align="right">{row.kilos}</TableCell>
                                                    <TableCell>
                                                        <Chip sx={{ fontSize: '12px', height: '20px' }} label={row.status === "ANU" ? "ANULADO" : 'ATENDIDO'} color={row.status === "ANU" ? "error" : 'success'} />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="EDITAR GUIA" placement="top">
                                                            <IconButton size="small" onClick={() => setDlgGuia({ open: true, titledlg: "EDITAR GUIA", idguia: row.idguia })}>
                                                                <Edit fontSize="small" color="warning" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {
                                                            row.status !== "ANU" &&
                                                            <Tooltip title="ANULAR GUIA" placement="top">
                                                                <IconButton size="small" onClick={() => deleteguia(row)}>
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
                                count={guias.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Filas por página"
                            />
                        </Paper>
                    </Grid>
                    <Dialog open={dlgGuia.open} fullWidth maxWidth="xs">
                        <DialogTitle>
                            {dlgGuia.titledlg}
                            <IconButton
                                aria-label="close"
                                onClick={handlecloseguia}
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
                            <NewGuia guia={dlgGuia} oncloseDlg={handlecloseguia} listarGuia={listguia} />
                        </DialogContent>
                    </Dialog>
                    <Dialog open={dialogPdfYear} fullWidth maxWidth="lg">
                        <DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={() => setDialogPdfYear(false)}
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
                                    <GuiaPdf data={guiasPdf} search={searchFechas} />
                                </PDFViewer>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={dialogPdfFecha} fullWidth maxWidth="lg">
                        <DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={() => setDialogPdfFecha(false)}
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
                                    <GuiaFechas data={datosFechas} search={searchFechas} />
                                </PDFViewer>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                </Grid>
            </Grid>
        </Grid>
    );
}