import { Search } from "@mui/icons-material";
import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import Swal from "sweetalert2";
import Config from "../../Config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList } from 'recharts';
import React, { useEffect, useState } from 'react';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 32,
    height: 20,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 16,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 16,
        height: 16,
        borderRadius: 8,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

const CustomizedAxisTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={3} textAnchor="end" style={{ fontSize: '11px', fontWeight: 'bold' }} fill="#666" transform="rotate(-90)">
                {payload.value}
            </text>
        </g>
    );
};

export const Ranking = () => {
    const mesActual = new Date().getMonth() + 1;
    const years = Array.from({ length: new Date().getFullYear() - 2021 }, (_, index) => 2022 + index);
    var fecha = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    const [ranking, setRanking] = useState([]);
    const [rankingObj, setRankingObj] = useState({
        fechaInicio: fecha,
        fechaFinal: fecha,
        filter: 0,
        mes: mesActual,
        year: 2023
    });
    var mesesDelAnio = [
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
    const colors = [
        '#1a237e',
        '#004d40',
        '#f57c00',
        '#880e4f',
        '#1b5e20',
        '#0d47a1',
        '#3e2723',
        '#1b5e20',
        '#b71c1c',
        '#1a237e',
        '#004d40',
        '#f57c00',
        '#880e4f',
        '#1b5e20',
        '#0d47a1',
        '#3e2723',
        '#1b5e20',
        '#b71c1c',
        '#1a237e',
        '#004d40',
    ];
    // handles
    const handleBusquedaRanking = (e) => {
        const { name, value, checked } = e.target;
        switch (name) {
            case 'filter':
                checked ? setRankingObj({ ...rankingObj, [name]: 1 }) : setRankingObj({ ...rankingObj, [name]: 0 });
                break;
            default:
                value ? setRankingObj({ ...rankingObj, [name]: value }) : setRankingObj({ ...rankingObj, [name]: '' });
                break;
        }
    }
    // apis
    const buscarRankingCosechadoras = async () => {
        const { fechaInicio, fechaFinal, filter, mes, year } = rankingObj;
        const response = await fetch(`${Config.URL_BASE}/cosechas/rankingcosechadora.php?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}&filter=${filter}&mes=${mes}&year=${year}`);
        const data = await response.json();
        if (!data.length) {
            Swal.fire({
                icon: 'info',
                title: 'Sin registros',
                text: 'No se encontraron registros para el fechas especificadas.',
            });
        } else {
            setRanking(data);
        }
    }
    useEffect(() => {
        const rankingCosechadoras = async () => {
            const { fechaInicio, fechaFinal, filter, mes, year } = rankingObj;
            const response = await fetch(`${Config.URL_BASE}/cosechas/rankingcosechadora.php?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}&filter=${filter}&mes=${mes}&year=${year}`);
            const data = await response.json();
            setRanking(data);
        }
        rankingCosechadoras();
    }, []);
    return (
        <Grid container spacing={2} justifyContent={"center"} height={"100vh"} alignContent={"center"}>
            <Grid item md={11}>
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>RANKING COSECHADORAS</Typography>
                        </Grid>
                        {
                            rankingObj.filter === 0 &&
                            <Grid item md={3} xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>MES</InputLabel>
                                    <Select
                                        size="small"
                                        value={rankingObj.mes}
                                        label="MES"
                                        name="mes"
                                        onChange={handleBusquedaRanking}
                                    >
                                        {mesesDelAnio.map((mes) => (
                                            <MenuItem key={mes.id} value={mes.id}>
                                                {mes.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        }
                        {
                            rankingObj.filter === 0 &&
                            <Grid item md={3} xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>AÑO</InputLabel>
                                    <Select
                                        size="small"
                                        value={rankingObj.year}
                                        label="AÑO"
                                        name="year"
                                        onChange={handleBusquedaRanking}
                                    >
                                        {years.map((year) => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        }
                        {
                            rankingObj.filter > 0 &&
                            <Grid item md={3} xs={6}>
                                <TextField
                                    label="FECHA INICIO"
                                    name="fechaInicio"
                                    size="small"
                                    type="date"
                                    margin="normal"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={rankingObj.fechaInicio}
                                    onChange={handleBusquedaRanking}
                                />
                            </Grid>
                        }
                        {
                            rankingObj.filter > 0 &&
                            <Grid item md={3} xs={6}>
                                <TextField
                                    label="FECHA FINAL"
                                    name="fechaFinal"
                                    size="small"
                                    type="date"
                                    margin="normal"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={rankingObj.fechaFinal}
                                    onChange={handleBusquedaRanking}
                                />
                            </Grid>
                        }
                        <Grid item md={4} xs={12} sx={{ mt: 1, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '13px' }}>FILTRO</Typography>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                                <Typography sx={{ fontSize: '13px' }}>MES</Typography>
                                <AntSwitch name="filter" checked={rankingObj.filter > 0} onChange={handleBusquedaRanking} inputProps={{ 'aria-label': 'ant design' }} />
                                <Typography sx={{ fontSize: '13px' }}>FECHA</Typography>
                            </Stack>
                        </Grid>
                        <Grid item md={2} xs={6} sx={{ mt: 2.5 }}>
                            <Button variant="contained" color="warning" startIcon={<Search />} fullWidth onClick={buscarRankingCosechadoras}>
                                BUSCAR
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                            <Paper>
                                <TableContainer sx={{ maxWidth: '275px', minWidth: '100%' }}>
                                    <Table aria-label="simple table" size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>COSECHADORA</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>COSECHA</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#2a8038', color: '#fff' }}>PUESTO</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {ranking.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ fontSize: '12px' }}>{row.cosechadora}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.cosecha}</TableCell>
                                                    <TableCell align="right" sx={{ fontSize: '12px' }}>{row.ranking}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        {ranking.length > 0 && (
                                            <TableFooter sx={{ backgroundColor: '#2a8038' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                        Total
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                        {ranking.reduce((total, row) => total + Number(row.cosecha), 0)}
                                                    </TableCell>
                                                    <TableCell>
                                                    </TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        )}
                                        {ranking.length === 0 && (
                                            <TableFooter>
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        NO HAY REGISTROS DISPONIBLES
                                                    </TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                        <Grid item md={6} xs={12} sx={{ mt: 3 }}>
                            {
                                ranking.length > 0 &&
                                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ overflowX: 'auto' }}>
                                        <BarChart
                                            width={650}
                                            height={500}
                                            data={ranking}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 10,
                                            }}
                                            barSize={35}
                                        >
                                            <Tooltip />
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="cosechadora"
                                                angle={-30}
                                                textAnchor="end"
                                                interval={0}
                                                height={220}
                                                tick={<CustomizedAxisTick />}
                                            />
                                            <YAxis
                                                domain={[0, Math.ceil(Math.max(...ranking.map(entry => entry.cosecha)) / 250) * 250]}
                                                tickCount={Math.ceil(Math.max(...ranking.map(entry => entry.cosecha)) / 250) + 1}
                                            />
                                            <Bar dataKey="cosecha" fill="#8884d8" background={{ fill: '#eee' }}>
                                                {
                                                    ranking.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                                                    ))
                                                }
                                                <LabelList dataKey="cosecha" position="top" style={{ fontSize: '11px', fontWeight: 'bold' }} />
                                            </Bar>
                                        </BarChart>
                                    </div>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}