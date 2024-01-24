import { AddCircleOutline, BarChart as BarIcon, Close, Search } from "@mui/icons-material";
import { Autocomplete, Button, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NewCosecha } from "./NewCosecha";
import Config from "../../Config";
import Swal from "sweetalert2";
import { PDFViewer } from "@react-pdf/renderer";
import { CosechasPdf } from "../reportes/CosechasPdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { RankingCosechadoras } from "./RankingCosechadoras";

export const Cosechas = () => {
    var fecha = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    // const table
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);
    // const app
    const [cosechas, setCosechas] = useState([]);
    const [dlgCosecha, setDlgCosecha] = useState(false);
    const [dlgRanking, setDlgRanking] = useState(false);
    const [dlgPdf, setDlgPdf] = useState(false);
    const [cosechaSearch, setCosechaSearch] = useState({ cosechadora: 0, fechainicio: fecha, fechafinal: fecha });
    const [sala1, setSala1] = useState([]);
    const [sala2, setSala2] = useState([]);
    const [sala3, setSala3] = useState([]);
    const [sala4, setSala4] = useState([]);
    const [sala5, setSala5] = useState([]);
    const [sala6, setSala6] = useState([]);
    const [sala7, setSala7] = useState([]);
    const [sala8, setSala8] = useState([]);
    const [sala9, setSala9] = useState([]);
    const [sala10, setSala10] = useState([]);
    const [sala11, setSala11] = useState([]);
    const [sala12, setSala12] = useState([]);
    const [cosechaCosechadora, setCosechaCosechadora] = useState([]);
    const [cosechadoras, setCosechadoras] = useState([]);
    const [cosechadoraCosecha, setCosechadoraCosecha] = useState([]);
    // handle table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 15));
        setPage(0);
    };
    // handles
    const handleSearch = (e) => {
        const { name, value } = e.target;
        setCosechaSearch({ ...cosechaSearch, [name]: value });
    }
    const handleAutocomplete = (e, values) => {
        if (values !== null) {
            setCosechaSearch({ ...cosechaSearch, cosechadora: values.idcosechadora });
        } else {
            setCosechaSearch({ ...cosechaSearch, cosechadora: 0 });
        }
    }
    // functions apis 
    const listarCosechas = async () => {
        const response = await fetch(`${Config.URL_BASE}/cosechas/listarcosechas.php`);
        const data = await response.json();
        setCosechas(data);
    }
    const buscarCosechasFechas = async () => {
        const { fechainicio, fechafinal, cosechadora } = cosechaSearch;
        if (fechainicio && fechafinal) {
            if (fechainicio <= fechafinal && fechafinal >= fechainicio) {
                const response = await fetch(`${Config.URL_BASE}/cosechas/buscarcosechasfechas.php?cosechadora=${cosechadora}&fechainicio=${fechainicio}&fechafinal=${fechafinal}`);
                const data = await response.json();
                setCosechas(data);
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
        setPage(0);
    }

    const openDlgPdf = async () => {
        const { fechainicio, fechafinal, cosechadora } = cosechaSearch;

        if (fechainicio && fechafinal) {
            const startDate = new Date(fechainicio);
            const endDate = new Date(fechafinal);

            const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // Milisegundos en un mes
            const isWithinOneMonth = endDate - startDate <= ONE_MONTH_MS;

            if (!isWithinOneMonth) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El rango de fechas no puede ser mayor a un mes.',
                });
                return;
            }

            if (fechainicio <= fechafinal) {
                if (cosechadora === 0) {
                    const salas = [setSala1, setSala2, setSala3, setSala4, setSala5, setSala6, setSala7, setSala8, setSala9, setSala10, setSala11, setSala12];
                    for (let i = 0; i < 12; i++) {
                        const response = await fetch(`${Config.URL_BASE}/reportes/listarcosechapdf.php?fechainicio=${fechainicio}&fechafinal=${fechafinal}&sala=${i + 1}`);
                        const data = await response.json();
                        salas[i](data);
                    }
                    const response = await fetch(`${Config.URL_BASE}/reportes/listarcosechacosechadorapdf.php?fechainicio=${fechainicio}&fechafinal=${fechafinal}`);
                    const data = await response.json();
                    if (data.length > 0) {
                        setDlgPdf(true);
                        setCosechaCosechadora(data);
                    } else {
                        Swal.fire({
                            icon: 'info',
                            title: 'No hay datos',
                            text: 'No se encontraron cosechas disponibles para las fechas.',
                        });
                    }
                } else {
                    const response = await fetch(`${Config.URL_BASE}/cosechas/buscarcosechasfechas.php?cosechadora=${cosechadora}&fechainicio=${fechainicio}&fechafinal=${fechafinal}`);
                    const data = await response.json();
                    if (data.length > 0) {
                        setDlgPdf(true);
                        setCosechadoraCosecha(data);
                    } else {
                        Swal.fire({
                            icon: 'info',
                            title: 'No hay datos',
                            text: 'No se encontraron cosechas disponibles para las fechas.',
                        });
                    }
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La fecha inicio no puede ser mayor a la fecha final',
                });
            }
        }
    };

    useEffect(() => {
        listarCosechas();
        const listarCosechadoras = async () => {
            const response = await fetch(`${Config.URL_BASE}/cosechadoras/listarcosechadoras.php`);
            const data = await response.json();
            setCosechadoras(data);
        }
        listarCosechadoras();
    }, []);
    return (
        <Grid container spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
            <Grid item xs={12} md={11}>
                <Stack direction={'row'} justifyContent={"space-between"}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>COSECHAS</Typography>
                    <Button
                        size="small"
                        color="success"
                        variant="contained"
                        startIcon={<AddCircleOutline />}
                        onClick={() => setDlgCosecha(true)}
                    >
                        NUEVO
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                    id="list-customer"
                    onChange={handleAutocomplete}
                    options={cosechadoras}
                    value={cosechadoras.find((cosechadora) => cosechadora.idcosechadora === cosechaSearch.cosechadora) || null}
                    getOptionLabel={(option) => option.nombre}
                    renderInput={(params) => <TextField {...params} label="COSECHADORA" size="small" />}
                />
            </Grid>
            <Grid item xs={6} sm={2} md={2}>
                <TextField
                    label="FECHA INICIO"
                    type="date"
                    size="small"
                    fullWidth
                    name="fechainicio"
                    value={cosechaSearch.fechainicio}
                    onChange={handleSearch}
                    error={!cosechaSearch.fechainicio}
                    helperText={!cosechaSearch.fechainicio ? 'Fecha inicio es obligatorio' : ''}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={6} sm={2} md={2}>
                <TextField
                    label="FECHA FINAL"
                    type="date"
                    size="small"
                    fullWidth
                    name="fechafinal"
                    value={cosechaSearch.fechafinal}
                    onChange={handleSearch}
                    error={!cosechaSearch.fechafinal}
                    helperText={!cosechaSearch.fechafinal ? 'Fecha final es obligatorio' : ''}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={6} sm={2} md={1}>
                <Button fullWidth variant="contained" color="warning" startIcon={<Search />} onClick={buscarCosechasFechas}>BUSCAR</Button>
            </Grid>
            <Grid item xs={6} sm={3} md={1}>
                <Button fullWidth color="error" variant="contained" startIcon={<FontAwesomeIcon icon={faFilePdf} />} onClick={openDlgPdf}>
                    PDF
                </Button>
            </Grid>
            <Grid item xs={6} sm={3} md={1}>
                <Button fullWidth color="primary" variant="contained" startIcon={<BarIcon />} onClick={() => setDlgRanking(true)}>
                    Ranking
                </Button>
            </Grid>
            <Grid item xs={12} md={11}>
                <Paper>
                    <TableContainer sx={{ maxWidth: '275px', minWidth: '100%' }}>
                        <Table aria-label="simple table" size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>FECHA</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>COSECHADORA</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>SALA</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>PESO</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>DESCARTE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cosechas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">NO HAY REGISTROS DISPONIBLES</TableCell>
                                    </TableRow>
                                ) : (rowsPerPage > 0
                                    ? cosechas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : cosechas
                                ).map((row) => (
                                    <TableRow
                                        key={row.idcosecha}
                                    >
                                        <TableCell>
                                            {row.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '12px' }}>{row.cosechadora}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '12px' }}>{row.sala}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '12px' }}>{row.peso}</TableCell>
                                        <TableCell align="right" sx={{ fontSize: '12px' }}>{row.descarte}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[15, 25, 50]}
                        count={cosechas.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página"
                    />
                </Paper>
            </Grid>
            <Dialog open={dlgPdf} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setDlgPdf(false)}
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
                            <CosechasPdf
                                sala1={sala1}
                                sala2={sala2}
                                sala3={sala3}
                                sala4={sala4}
                                sala5={sala5}
                                sala6={sala6}
                                sala7={sala7}
                                sala8={sala8}
                                sala9={sala9}
                                sala10={sala10}
                                sala11={sala11}
                                sala12={sala12}
                                cosechaSearch={cosechaSearch}
                                cosechaCosechadora={cosechaCosechadora}
                                cosechadoraCosecha={cosechadoraCosecha}
                            />
                        </PDFViewer>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog open={dlgCosecha}>
                <DialogTitle>
                    NUEVA COSECHA
                    <IconButton
                        aria-label="close"
                        onClick={() => setDlgCosecha(false)}
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
                    <NewCosecha onCloseDlg={() => setDlgCosecha(false)} listarCosechas={listarCosechas} />
                </DialogContent>
            </Dialog>
            <Dialog open={dlgRanking} maxWidth="md" fullWidth>
                <DialogTitle>
                    RANKING DE COSECHADORAS
                    <IconButton
                        aria-label="close"
                        onClick={() => setDlgRanking(false)}
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
                    <RankingCosechadoras />
                </DialogContent>
            </Dialog>
        </Grid>

    );
}