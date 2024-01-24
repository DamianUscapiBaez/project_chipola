import { AddCircleOutline, Close, Edit, FilterAlt, FilterAltOff, Search } from "@mui/icons-material"
import { Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import Config from "../../Config";
import { NewDespacho } from "./NewDespacho";
// import Swal from "sweetalert2";
import { PDFViewer } from "@react-pdf/renderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { DespachoPdf } from "../reportes/DespachoPdf";
import { DespachoFechaPdf } from "../reportes/DespachoFecha";
import Swal from "sweetalert2";

export const Despachos = () => {
    var fecha = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    // const table
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);
    // arrays select
    var mesesDelAnio = [
        { id: 0, nombre: "TODO" },
        { id: 1, nombre: "ENERO" },
        { id: 2, nombre: "FEBRERO" },
        { id: 3, nombre: "MARZO" },
        { id: 4, nombre: "ABRIL" },
        { id: 5, nombre: "MAYO" },
        { id: 6, nombre: "JUNIO" },
        { id: 7, nombre: "JULIO" },
        { id: 8, nombre: "AGOSTO" },
        { id: 9, nombre: "SEPTIEMBRE" },
        { id: 10, nombre: "OCTUBRE" },
        { id: 11, nombre: "NOVIEMBRE" },
        { id: 12, nombre: "DICIEMBRE" }
    ];
    const years = Array.from({ length: new Date().getFullYear() - 2018 }, (_, index) => 2019 + index);
    // const dialog
    const [dlgDespacho, setDlgDespacho] = useState({
        show: false,
        titledlg: '',
        iddespacho: 0
    });
    // const app
    const [despachos, setDespachos] = useState([]);
    const [dialogPdfYear, setDialogPdfYear] = useState(false);
    const [dialogPdfFecha, setDialogPdfFecha] = useState(false);
    const [dataPdf, setDataPdf] = useState([]);
    const [dataPdfHoy, setDataPdfHoy] = useState([]);
    const [searchDespacho, setSearchDespacho] = useState({
        mescosecha: 0,
        yearcosecha: new Date().getFullYear()
    });
    const [busquedaDespachos, setBusquedaDespachos] = useState({
        fechainicio: fecha,
        fechafinal: fecha
    });
    const [buttonValue, setButtonValue] = useState('');
    const handlebutton = (e, value) => {
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
    // handle dialog 
    const handleOpenDialog = () => {
        setDlgDespacho({ show: true, titledlg: 'NUEVA COSECHA', iddespacho: 0 });
    }
    const handleCloseDialog = () => {
        setDlgDespacho({ show: false, titledlg: '', iddespacho: 0 });
    }
    // handles
    const handleSearch = (e) => {
        const { name, value } = e.target;
        setSearchDespacho({ ...searchDespacho, [name]: value });
    }
    const handleBusqueda = (e) => {
        const { name, value } = e.target;
        setBusquedaDespachos({ ...busquedaDespachos, [name]: value });
    }
    // functions apis
    const listarDespachos = async () => {
        const response = await fetch(`${Config.URL_BASE}/despacho/listardespacho.php`);
        const data = await response.json();
        setDespachos(data);
    }
    const buscarDespachos = async () => {
        const { mescosecha, yearcosecha } = searchDespacho;
        const response = await fetch(`${Config.URL_BASE}/despacho/buscardespacho.php?mescosecha=${mescosecha}&yearcosecha=${yearcosecha}`);
        const data = await response.json();
        setDespachos(data);
    }
    const buscarDespachoFecha = async () => {
        const { fechainicio, fechafinal } = busquedaDespachos;
        if (fechainicio && fechafinal) {
            if (fechainicio <= fechafinal && fechafinal >= fechainicio) {
                const response = await fetch(`${Config.URL_BASE}/reportes/listardespachofechapdf.php?fechainicio=${fechainicio}&fechafinal=${fechafinal}`);
                const data = await response.json();
                setDespachos(data);
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
        const { mescosecha, yearcosecha } = searchDespacho;
        if (mescosecha === 0) {
            const response = await fetch(`${Config.URL_BASE}/reportes/listardespachopdf.php?year=${yearcosecha}`);
            const data = await response.json();
            if (data.length > 0) {
                setDataPdf(data);
                setDialogPdfYear(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No hay datos disponibles para el mes seleccionado',
                });
            }
        } else {
            const response = await fetch(`${Config.URL_BASE}/despacho/buscardespacho.php?mescosecha=${mescosecha}&yearcosecha=${yearcosecha}`);
            const data = await response.json();
            if (data.length > 0) {
                setDataPdf(data);
                setDialogPdfYear(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No hay datos disponibles para el mes y año seleccionado',
                });
            }
        }
    }
    const obtenerDatosFechaPdf = async () => {
        const { fechainicio, fechafinal } = busquedaDespachos;
        if (fechainicio && fechafinal) {
            if (fechainicio <= fechafinal && fechafinal >= fechainicio) {
                const response = await fetch(`${Config.URL_BASE}/reportes/listardespachofechapdf.php?fechainicio=${fechainicio}&fechafinal=${fechafinal}`);
                const data = await response.json();
                if (data.length > 0) {
                    setDataPdfHoy(data);
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
    };
    useEffect(() => {
        listarDespachos();
    }, []);
    return (
        <Grid container sx={{ justifyContent: 'center' }}>
            <Grid item xs={11}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                    <Grid item xs={12}>
                        <Stack direction={'row'} justifyContent={"space-between"}>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>DESPACHOS</Typography>
                            <Button
                                size="small"
                                color="success"
                                variant="contained"
                                startIcon={<AddCircleOutline />}
                                onClick={handleOpenDialog}>
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
                            <ToggleButton value="M">
                                {buttonValue === "M" ? <FilterAltOff /> : <FilterAlt />}
                                FILTRO POR MES - AÑO
                            </ToggleButton>
                            <ToggleButton value="F">
                                {buttonValue === "F" ? <FilterAltOff /> : <FilterAlt />}
                                FILTRO POR FECHAS
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    {
                        buttonValue === "M" &&
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={4} md={2}>
                                        <FormControl fullWidth>
                                            <InputLabel>MES</InputLabel>
                                            <Select
                                                size="small"
                                                value={searchDespacho.mescosecha}
                                                label="MES"
                                                name="mescosecha"
                                                onChange={handleSearch}
                                            >
                                                {mesesDelAnio.map((mes) => (
                                                    <MenuItem key={mes.id} value={mes.id}>
                                                        {mes.nombre}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sm={4} md={2}>
                                        <FormControl fullWidth>
                                            <InputLabel>AÑO</InputLabel>
                                            <Select
                                                size="small"
                                                value={searchDespacho.yearcosecha}
                                                label="AÑO"
                                                name="yearcosecha"
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
                                    <Grid item xs={6} sm={3} md={2}>
                                        <Button fullWidth variant="contained" color="warning" startIcon={<Search />} onClick={buscarDespachos}>BUSCAR</Button>
                                    </Grid>
                                    <Grid item xs={6} sm={3} md={2}>
                                        <Button fullWidth color="error" variant="contained" startIcon={<FontAwesomeIcon icon={faFilePdf} />} onClick={obtenerDatosPdf}>
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
                                    <Grid item xs={6} sm={2}>
                                        <TextField
                                            label="FECHA INICIO"
                                            type="date"
                                            size="small"
                                            fullWidth
                                            name="fechainicio"
                                            value={busquedaDespachos.fechainicio}
                                            onChange={handleBusqueda}
                                            error={!busquedaDespachos.fechainicio}
                                            helperText={!busquedaDespachos.fechainicio ? 'Fecha inicio es obligatorio' : ''}
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
                                            value={busquedaDespachos.fechafinal}
                                            onChange={handleBusqueda}
                                            error={!busquedaDespachos.fechafinal}
                                            helperText={!busquedaDespachos.fechafinal ? 'Fecha final es obligatorio' : ''}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3} md={2}>
                                        <Button fullWidth variant="contained" color="warning" startIcon={<Search />} onClick={buscarDespachoFecha}>BUSCAR</Button>
                                    </Grid>
                                    <Grid item xs={6} sm={3} md={2}>
                                        <Button fullWidth color="error" variant="contained" startIcon={<FontAwesomeIcon icon={faFilePdf} />} onClick={obtenerDatosFechaPdf}>
                                            PDF
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <Paper>
                            <TableContainer sx={{ maxWidth: '275px', minWidth: '100%', height: !buttonValue ? '65vh' : '55vh' }}>
                                <Table aria-label="simple table" size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>FECHA</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>SALDO ANTERIOR</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>COSECHA DIA</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>TOTAL COSECHA</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>DESPACHO DIA</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>DESCARTE DIA</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>SALDO COSECHA</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>VARIACION COSECHA</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>ACCIONES</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {despachos.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center">NO HAY REGISTROS DISPONIBLES</TableCell>
                                            </TableRow>
                                        ) : (
                                            (rowsPerPage > 0
                                                ? despachos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                : despachos
                                            ).map((row) => (
                                                <TableRow key={row.iddespacho}>
                                                    <TableCell>
                                                        {row.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.saldoanterior}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.cosechadia}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.totalcosecha}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.despachodia}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.descartedia}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.saldofinal}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.variacioncosecha}</TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="EDITAR DESPACHO" placement="top">
                                                            <IconButton size="small" onClick={() => setDlgDespacho({ show: true, titledlg: 'EDITAR COSECHA', iddespacho: row.iddespacho })}>
                                                                <Edit fontSize="small" color="warning" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                rowsPerPageOptions={[15, 30, 45]}
                                count={despachos.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Filas por página"
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <Dialog open={dlgDespacho.show} maxWidth="xs">
                    <DialogTitle>
                        {dlgDespacho.titledlg}
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseDialog}
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
                        <NewDespacho onCloseDlg={handleCloseDialog} listarDespachos={listarDespachos} dlgDespacho={dlgDespacho} />
                    </DialogContent>
                </Dialog>
                <Dialog open={dialogPdfYear} maxWidth="lg" fullWidth>
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
                                <DespachoPdf data={dataPdf} searchDespacho={searchDespacho} mesesDelAnio={mesesDelAnio} yearpdf={searchDespacho.yearcosecha} />
                            </PDFViewer>
                        </Grid>
                    </DialogContent>
                </Dialog>
                <Dialog open={dialogPdfFecha} maxWidth="lg" fullWidth>
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
                                <DespachoFechaPdf buscarDespachos={busquedaDespachos} data={dataPdfHoy} />
                            </PDFViewer>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Grid>
        </Grid >
    )
}
