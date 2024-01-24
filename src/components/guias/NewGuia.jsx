import { Autocomplete, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import Swal from "sweetalert2";

export const NewGuia = ({ oncloseDlg, listarGuia, guia }) => {
    var fecha = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    const [customers, setCustomers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [guide, setGuide] = useState({
        idguia: 0,
        nroguia: '',
        idcustomer: 0,
        fecha: fecha,
        kilos: ''
    });
    const [documentSelect, setDocumentSelect] = useState({
        iddocument: 0,
        documento: ''
    });
    const [errors, setErrors] = useState({
        nroguia: '',
        idcustomer: '',
        fecha: '',
        kilos: ''
    });
    // handle
    const handleform = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'kilos':
                if (value !== "") {
                    if (!isNaN(value) && /^\d+(\.\d{0,3})?$/.test(value)) {
                        setGuide({ ...guide, [name]: value });
                    }
                    setErrors((prevRegistro) => ({
                        ...prevRegistro,
                        [name]: ''
                    }));
                } else {
                    setGuide({ ...guide, [name]: '' });
                }
                break;
            default:
                setGuide({ ...guide, [name]: value });
                setErrors((prevRegistro) => ({
                    ...prevRegistro,
                    [name]: ''
                }));
                break;
        }
    }
    const handleAutocompleta = (e, values) => {
        if (values !== null) {
            setGuide({ ...guide, idcustomer: values.idcustomer });
            setErrors((prevRegistro) => ({
                ...prevRegistro,
                idcustomer: ''
            }));
            listarDocuments(values.idcustomer);
            setDocumentSelect({ iddocument: 0, documento: '' });
        } else {
            setGuide({ ...guide, idcustomer: '' });
        }
    }
    const handleAutocompleteDocument = (e, values) => {
        if (values !== null) {
            setDocumentSelect(values);
        } else {
            setDocumentSelect({
                iddocument: 0,
                documento: ''
            });
        }
    }
    // functions
    const listarDocuments = async (idcustomer) => {
        const response = await fetch(`${Config.URL_BASE}/register/listarregistercliente.php?idcustomer=${idcustomer}`);
        const data = await response.json();
        setDocuments(data);
    }
    const listarClientes = async () => {
        const response = await fetch(`${Config.URL_BASE}/customer/listarclientes.php`);
        const data = await response.json();
        setCustomers(data);
    }
    const guardarGuia = async () => {
        const newErrors = {
            idcustomer: !guide.idcustomer ? 'Este campo es obligatorio' : '',
            nroguia: !guide.nroguia ? 'Este campo es obligatorio' : '',
            fecha: !guide.fecha ? 'Este campo es obligatorio' : '',
            kilos: !guide.kilos ? 'Este campo es obligatorio' : ''
        }
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === '')) {
            const response = await fetch(`${Config.URL_BASE}/guide/guardarguide.php`, {
                method: 'POST',
                body: JSON.stringify({
                    idguia: guide.idguia,
                    nroguia: !guide.nroguia ? '' : guide.nroguia.replace(/\s+/g, '').toUpperCase(),
                    idcustomer: guide.idcustomer,
                    fecha: guide.fecha,
                    kilos: guide.kilos
                })
            });
            const data = await response.json();
            if (data.guardado) {
                await fetch(`${Config.URL_BASE}/guide/eliminartodoguiaregister.php?idguia=${data.codigo}`);
                if (documentSelect.iddocument > 0) {
                    await fetch(`${Config.URL_BASE}/register/guardarregisterguide.php`, {
                        method: 'POST',
                        body: JSON.stringify({ iddocument: documentSelect.iddocument, idguia: data.codigo })
                    });
                }
                Swal.fire(
                    'Guardado!',
                    'Se completó exitosamente.',
                    'success'
                );
                oncloseDlg();
                listarGuia();
            } else if (data.existe) {
                Swal.fire(
                    'Error',
                    'El número de guía ya existe.',
                    'error'
                );
            } else {
                Swal.fire(
                    'Error',
                    'Hubo un problema al guardar la guía.',
                    'error'
                );
            }
        }
    }
    const recuperarGuia = async (idguia) => {
        const response = await fetch(`${Config.URL_BASE}/guide/recuperarguide.php?idguia=${idguia}`);
        const data = await response.json();
        setGuide(data);
        listarDocuments(data.idcustomer);
        const responseGuiaRegister = await fetch(`${Config.URL_BASE}/guide/listarregisterguia.php?idguia=${idguia}`);
        const dataGuiaRegister = await responseGuiaRegister.json();
        if (dataGuiaRegister) {
            setDocumentSelect(dataGuiaRegister);
        }
    }
    // effect
    useEffect(() => {
        if (guia.idguia !== undefined && guia.idguia > 0) recuperarGuia(guia.idguia);
        listarClientes();
    }, [guia]);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    name="nroguia"
                    label="NRO GUIA"
                    value={guide.nroguia}
                    onChange={handleform}
                    inputProps={{ maxLength: 40, style: { textTransform: 'uppercase' } }}
                    margin="normal"
                    error={!!errors.nroguia}
                    helperText={errors.nroguia}
                />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    id="list-customer"
                    onChange={handleAutocompleta}
                    options={customers}
                    value={customers.find((cliente) => cliente.idcustomer === guide.idcustomer) || null}
                    getOptionLabel={(option) => option.tradename}
                    renderInput={(params) =>
                        <TextField {...params}
                            label="CLIENTE"
                            margin="normal"
                            error={!!errors.idcustomer}
                            helperText={errors.idcustomer} />
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    id="list-customer"
                    onChange={handleAutocompleteDocument}
                    options={documents}
                    disabled={!guide.idcustomer > 0}
                    value={documents.find((d) => d.iddocument === documentSelect.iddocument) || null}
                    getOptionLabel={(option) => option.documento}
                    renderInput={(params) =>
                        <TextField {...params}
                            label="FACTURA - BOLETA"
                            margin="normal"
                        />
                    }
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="PESO"
                    margin="normal"
                    name="kilos"
                    value={guide.kilos}
                    onChange={handleform}
                    error={!!errors.kilos}
                    helperText={errors.kilos}
                    inputProps={{ maxLength: 12 }}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    label="FECHA"
                    margin="normal"
                    name="fecha"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={guide.fecha}
                    onChange={handleform}
                    error={!!errors.fecha}
                    helperText={errors.fecha}
                />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button onClick={guardarGuia} variant="contained" color="success">GUARDAR</Button>
                <Button sx={{ ml: 1 }} onClick={() => oncloseDlg()} variant="contained" color="error">CANCELAR</Button>
            </Grid>
        </Grid>
    );
}