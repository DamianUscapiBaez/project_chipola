import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import Swal from "sweetalert2";

export const NewCosecha = ({ onCloseDlg, listarCosechas }) => {
    const date = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');

    // const app
    const [cosecha, setCosecha] = useState({
        idcosecha: 0,
        idcosechadora: '',
        fecha: date,
        sala: 0,
        peso: '',
        descarte: ''
    });
    const [cosechadoras, setCosechadoras] = useState([]);
    const [errors, setErrors] = useState({ cosechadora: '', fecha: '', sala: '', peso: '' });
    // handles
    const handleForm = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'descarte':
            case 'peso':
                if (value !== "") {
                    if (!isNaN(value) && /^\d+(\.\d{0,3})?$/.test(value)) {
                        setCosecha({ ...cosecha, [name]: value });
                    }
                    setErrors((prevRegistro) => ({
                        ...prevRegistro,
                        [name]: ''
                    }));
                } else {
                    setCosecha({ ...cosecha, [name]: '' });
                }
                break;
            default:
                setCosecha({ ...cosecha, [name]: value });
                setErrors((prevRegistro) => ({
                    ...prevRegistro,
                    [name]: ''
                }));
                break;
        }
    }
    const handleAutocomplete = (e, values) => {
        if (values !== null) {
            setCosecha({ ...cosecha, idcosechadora: values.idcosechadora });
        } else {
            setCosecha({ ...cosecha, idcosechadora: '' });
        }
    }
    // functions apis
    const guardarCosecha = async () => {
        const newErrors = {
            cosechadora: !cosecha.idcosechadora ? 'Este campo es obligatorio' : '',
            fecha: !cosecha.fecha ? 'Este campo es obligatorio' : '',
            sala: !cosecha.sala ? 'Este campo es obligatorio' : '',
            peso: !cosecha.peso ? 'Este campo es obligatorio' : ''
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === '')) {
            const response = await fetch(`${Config.URL_BASE}/cosechas/guardarcosecha.php`, {
                method: 'POST',
                body: JSON.stringify(cosecha)
            });
            const data = await response.json();
            if (data.guardado === true) {
                Swal.fire(
                    'Guardado!',
                    'Se completó exitosamente.',
                    'success'
                );
                onCloseDlg();
                listarCosechas();
            } else if (data.guardado === 'exist') {
                Swal.fire(
                    'Error',
                    data.mensaje,
                    'error'
                );
            }
        }
    }
    // effects
    useEffect(() => {
        const listarCosechadoras = async () => {
            const response = await fetch(`${Config.URL_BASE}/cosechadoras/listarcosechadoras.php`);
            const data = await response.json();
            setCosechadoras(data);
        }
        listarCosechadoras();
    }, []);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
                <Autocomplete
                    id="list-customer"
                    options={cosechadoras}
                    getOptionLabel={(option) => option.nombre}
                    renderInput={(params) => <TextField {...params}
                        label="COSECHADORA"
                        margin="normal"
                        error={!!errors.cosechadora}
                        helperText={errors.cosechadora}
                    />}
                    onChange={handleAutocomplete}
                    value={cosechadoras.find((cosechadora) => cosechadora.idcosechadora === cosecha.idcosechadora) || null}
                    fullWidth
                />
            </Grid>
            <Grid item sm={4} xs={6}>
                <TextField
                    fullWidth
                    name="fecha"
                    value={cosecha.fecha}
                    onChange={handleForm}
                    error={!!errors.fecha}
                    helperText={errors.fecha}
                    label="FECHA"
                    type="date"
                    margin="normal"
                />
            </Grid>
            <Grid item sm={4} xs={6}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>SALA</InputLabel>
                    <Select
                        label="SALA"
                        name="sala"
                        value={cosecha.sala}
                        onChange={handleForm}
                    >
                        {Array.from({ length: 12 }, (_, index) => (
                            <MenuItem key={index} value={index + 1}>
                                SALA {index + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item sm={4} xs={6}>
                <TextField
                    label="PESO"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 12 }}
                    name="peso"
                    value={cosecha.peso}
                    onChange={handleForm}
                    error={!!errors.peso}
                    helperText={errors.peso}
                />
            </Grid>
            <Grid item sm={4} xs={6}>
                <TextField
                    label="DESCARTE"
                    fullWidth
                    margin="normal"
                    inputProps={{ maxLength: 12 }}
                    name="descarte"
                    value={cosecha.descarte}
                    onChange={handleForm}
                />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button variant="contained" color="success" onClick={guardarCosecha}>GUARDAR</Button>
                <Button sx={{ ml: 1 }} variant="contained" color="error" onClick={onCloseDlg}>CANCELAR</Button>
            </Grid>
        </Grid>
    );
}