import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import Swal from "sweetalert2";

// eslint-disable-next-line react/prop-types
export const NewDespacho = ({ onCloseDlg, listarDespachos, dlgDespacho }) => {
    const date = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    // const app 
    const [despacho, setDespacho] = useState({
        iddespacho: 0,
        fecha: date,
        cosechadia: '',
        despachodia: '',
        saldoanterior: '0.00',
        descartedia: ''
    });
    const [errors, setErrors] = useState({
        fecha: '',
        cosechadia: '',
        despachodia: ''
    });
    // handles form
    const handleForm = async (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'fecha':
                setDespacho({ ...despacho, [name]: value });
                setErrors((prevRegistro) => ({
                    ...prevRegistro,
                    [name]: '',
                }));
                if (value !== date) recuperarSaldoAnterior(value);
                break;
            case 'cosechadia':
            case 'despachodia':
            case 'descartedia':
                if (value !== '') {
                    if (!isNaN(value) && /^\d+(\.\d{0,3})?$/.test(value)) {
                        setDespacho({ ...despacho, [name]: value });
                    }
                    setErrors((prevRegistro) => ({
                        ...prevRegistro,
                        [name]: '',
                    }));
                } else {
                    setDespacho({ ...despacho, [name]: '' });
                }
                break;
            default:
                setDespacho({ ...despacho, [name]: value });
                setErrors((prevRegistro) => ({
                    ...prevRegistro,
                    [name]: '',
                }));
                break;
        }
    };


    // functions apis 
    const guardarDespacho = async () => {
        const newErrors = {
            fecha: !despacho.fecha ? 'Este campo es obligatorio' : '',
            cosechadia: !despacho.cosechadia ? 'Este campo es obligatorio' : '',
            despachodia: !despacho.despachodia ? 'Este campo es obligatorio' : ''
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === '')) {
            const response = await fetch(`${Config.URL_BASE}/despacho/guardardespacho.php`, {
                method: 'POST',
                body: JSON.stringify({
                    iddespacho: despacho.iddespacho,
                    fecha: despacho.fecha,
                    cosechadia: despacho.cosechadia,
                    despachodia: despacho.despachodia,
                    saldoanterior: despacho.saldoanterior,
                    descartedia: despacho.descartedia
                })
            });
            const data = await response.json();
            if (data.guardado) {
                Swal.fire(
                    'Guardado!',
                    'Se completó exitosamente.',
                    'success'
                );
                onCloseDlg();
                listarDespachos();
            } else if (!data.guardado && data.mensaje) {
                Swal.fire(
                    'Error',
                    data.mensaje,
                    'error'
                );
            }
        }
    };

    const recuperarSaldoAnterior = async (fecha) => {
        const response = await fetch(`${Config.URL_BASE}/despacho/obtenersaldoanterior.php?fecha=${fecha}`);
        const data = await response.json();
        setDespacho({ ...despacho, fecha, saldoanterior: data });
    }
    useEffect(() => {
        const recuperarDespacho = async (iddespacho) => {
            const response = await fetch(`${Config.URL_BASE}/despacho/recuperardespacho.php?iddespacho=${iddespacho}`);
            const data = await response.json();
            setDespacho(data);
        }
        if (dlgDespacho.iddespacho !== undefined && dlgDespacho.iddespacho > 0) recuperarDespacho(dlgDespacho.iddespacho);
        if (dlgDespacho.iddespacho !== undefined && dlgDespacho.iddespacho === 0) recuperarSaldoAnterior(date);
    }, []);
    return (
        <Grid container spacing={2}>
            <Grid item sm={6} xs={12}>
                <TextField
                    label="FECHA"
                    type="date"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    name="fecha"
                    value={despacho.fecha}
                    onChange={handleForm}
                    error={errors.fecha !== ""}
                    helperText={errors.fecha}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="SALDO ANTERIOR"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 12 }}
                    name="saldoanterior"
                    value={despacho.saldoanterior}
                    onChange={handleForm}
                    disabled
                />
            </Grid>
            <Grid item xs={6} sm={4}>
                <TextField
                    label="COSECHA DIA"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 12 }}
                    name="cosechadia"
                    value={despacho.cosechadia}
                    onChange={handleForm}
                    error={errors.cosechadia !== ""}
                    helperText={errors.cosechadia}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={6} sm={4}>
                <TextField
                    label="DESPACHO DIA"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 12 }}
                    name="despachodia"
                    value={despacho.despachodia}
                    onChange={handleForm}
                    error={errors.despachodia !== ""}
                    helperText={errors.despachodia}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={6} sm={4}>
                <TextField
                    label="DESCARTE DIA"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 12 }}
                    name="descartedia"
                    value={despacho.descartedia}
                    onChange={handleForm}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button variant="contained" color="success" onClick={guardarDespacho}>GUARDAR</Button>
                <Button onClick={() => onCloseDlg()} sx={{ ml: 1 }} variant="contained" color="error">CANCELAR</Button>
            </Grid>
        </Grid>
    );
}