import { Container, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../Config";
import factura from '../assets/factura.png';
import boleta from '../assets/boleta.png';
import pettycash from '../assets/pettycash.png';
import cosecha from '../assets/cosecha.png';
import balanza from '../assets/balanza.png';
import venta from '../assets/venta.png';

export const Home = () => {
    const years = Array.from({ length: new Date().getFullYear() - 2022 }, (_, index) => 2023 + index);
    const [year, setYear] = useState(new Date().getFullYear());
    const [deudaFactura, setDeudaFactura] = useState(0);
    const [deudaBoleta, setDeudaBoleta] = useState(0);
    const [totalKilosGuia, setTotalKilosGuia] = useState([]);
    const [totalKilosCosecha, setTotalKilosCosecha] = useState([]);
    const [totalVentasYear, setTotalVentasYear] = useState([]);
    const [totalVentas, setTotalVentas] = useState(0);
    const sumaTotalKilos = totalKilosGuia.reduce((total, item) => {
        return total + parseFloat(item.Total_kilos);
    }, 0);
    const sumaTotalKilosCosecha = totalKilosCosecha.reduce((total, item) => {
        return total + parseFloat(item.Total_cosecha);
    }, 0);
    const sumaTotalVentasYear = totalVentasYear.reduce((total, item) => {
        return total + parseFloat(item.Total_ventas);
    }, 0);

    // Functions for API calls
    const obtenerDeudaDocumento = async (typedocument) => {
        const response = await fetch(
            `${Config.URL_BASE}/dashboard/totalregistropediente.php?typedocument=${typedocument}&year=${year}`
        );
        const data = await response.json();
        return data.deudaregistro;
    };
    // Event handler for search
    const handleSearch = async (e) => {
        const { value } = e.target;
        setYear(value);
    };

    // Fetch data
    const fetchData = async () => {
        // Fetch facturas y boletas
        const deudaF = await obtenerDeudaDocumento("F");
        const deudaB = await obtenerDeudaDocumento("B");
        setDeudaFactura(deudaF);
        setDeudaBoleta(deudaB);

        // Fetch guias
        const kilosGuia = await fetch(`${Config.URL_BASE}/dashboard/totalkilosguias.php?year=${year}`);
        const dataKilos = await kilosGuia.json();
        setTotalKilosGuia(dataKilos);

        // Fetch cosecha
        const kilosCosecha = await fetch(`${Config.URL_BASE}/dashboard/totalkiloscosecha.php?year=${year}`);
        const dataCosecha = await kilosCosecha.json();
        setTotalKilosCosecha(dataCosecha);

        // Fetch atendido
        const totalVentasYears = await fetch(`${Config.URL_BASE}/dashboard/totalventasyear.php?year=${year}`);
        const dataTotalVentasYear = await totalVentasYears.json();
        setTotalVentasYear(dataTotalVentasYear);

        const totalventasapi = await fetch(`${Config.URL_BASE}/dashboard/totalventas.php?year=${year}`);
        const response = await totalventasapi.json();
        setTotalVentas(response);
    };

    useEffect(() => {
        fetchData();
    }, [year, deudaBoleta, deudaFactura, totalVentas]);
    return (
        <Grid container spacing={2} sx={{ mt: 3, justifyContent: "center" }}>
            <Grid item md={8}></Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth>
                    <InputLabel>Año</InputLabel>
                    <Select
                        size="small"
                        value={year}
                        label="Año"
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
            <Grid item xs={12} sm={6} md={2.5}>
                <Paper elevation={2} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                    <Typography sx={{ fontWeight: "bold" }} variant="h6">TOTAL DE VENTAS (ANUAL)</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction={'row'} sx={{ alignItems: 'center', justifyContent: 'center', mt: 2, mb: 2 }}>
                        <img src={pettycash} alt="pettycash" width={60} height={60} />
                        <Typography sx={{ fontWeight: 'bold', ml: 5 }}>
                            S/. {Number(totalVentas).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                    </Stack>
                    <Divider />
                    <Typography sx={{ fontWeight: "bold", mt: 3 }}>CUENTAS POR COBRAR</Typography>
                    <Typography sx={{ fontWeight: 'bold', mt: 2 }}>
                        S/. {(Number(deudaFactura) + Number(deudaBoleta)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography sx={{ fontWeight: "bold", mt: 3 }}>FACTURAS</Typography>
                    <Stack direction={'row'} sx={{ alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        <img src={factura} alt="factura" width={50} height={50} />
                        <Typography sx={{ fontWeight: 'bold', ml: 5 }}>S/. {Number(deudaFactura).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                    </Stack>
                    <Typography sx={{ fontWeight: "bold", mt: 3 }}>BOLETAS</Typography>
                    <Stack direction={'row'} sx={{ alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        <img src={boleta} alt="boleta" width={50} height={50} />
                        <Typography sx={{ fontWeight: 'bold', ml: 5 }}>S/. {Number(deudaBoleta).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
                <Paper elevation={2} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>TOTAL KILOS (COSECHA)</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction={'row'} sx={{ alignItems: 'center', justifyContent: 'center', mt: 2, mb: 2 }}>
                        <img src={cosecha} alt="cosecha" width={50} height={50} />
                        <Typography sx={{ fontWeight: 'bold', ml: 5 }}>
                            {sumaTotalKilosCosecha.toLocaleString("es", { minimumFractionDigits: 3 })}
                        </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    {totalKilosCosecha.map((item, index) => (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} key={index}>
                            <Typography sx={{ fontWeight: 'bold' }}>{item.Mes}</Typography>
                            <Typography>{Number(item.Total_cosecha).toLocaleString(undefined, { minimumFractionDigits: 3 })}</Typography>
                        </div>
                    ))}
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
                <Paper elevation={2} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>TOTAL ATENCION KILOS (GUIAS)</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction={'row'} sx={{ alignItems: 'center', justifyContent: 'center', mt: 2, mb: 2 }}>
                        <img src={balanza} alt="balanza" width={50} height={50} />
                        <Typography sx={{ fontWeight: 'bold', ml: 5 }}>
                            {sumaTotalKilos.toLocaleString(undefined, { minimumFractionDigits: 3 })}
                        </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    {totalKilosGuia.map((item, index) => (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} key={index}>
                            <Typography sx={{ fontWeight: 'bold' }}>{item.Mes}</Typography>
                            <Typography>{Number(item.Total_kilos).toLocaleString(undefined, { minimumFractionDigits: 3 })}</Typography>
                        </div>
                    ))}
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
                <Paper elevation={2} sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>TOTAL VENTAS KILOS (SEGUN PLANTA)</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction={'row'} sx={{ alignItems: 'center', justifyContent: 'center', mt: 2, mb: 2 }}>
                        <img src={venta} alt="balanza" width={50} height={50} />
                        <Typography sx={{ fontWeight: 'bold', ml: 5 }}>
                            {sumaTotalVentasYear.toLocaleString(undefined, { minimumFractionDigits: 3 })}
                        </Typography>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    {totalVentasYear.map((item, index) => (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} key={index}>
                            <Typography sx={{ fontWeight: 'bold' }}>{item.Mes}</Typography>
                            <Typography>{Number(item.Total_ventas).toLocaleString(undefined, { minimumFractionDigits: 3 })}</Typography>
                        </div>
                    ))}
                </Paper>
            </Grid>
        </Grid>
    );
};
