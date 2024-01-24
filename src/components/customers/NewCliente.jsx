import { Button, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import Swal from "sweetalert2";

export const NewCliente = ({ onClose, listarCliente, customerObj }) => {
    const [customer, setCustomer] = useState({
        idcustomer: 0,
        typedocument: '',
        namecustomer: '',
        tradename: '',
        documentcustomer: '',
        unitprice: '',
        type: '',
        diaspago: 0,
        ejecutivo: 0
    });
    const [errors, setErrors] = useState({
        typedocument: '',
        namecustomer: '',
        tradename: '',
        documentcustomer: '',
        unitprice: '',
        type: ''
    });
    // handles
    const handleForm = (e) => {
        const { name, value, checked } = e.target;
        switch (name) {
            case 'unitprice':
                if (value !== "") {
                    if (!isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
                        setCustomer({ ...customer, [name]: value });
                    }
                    setErrors((prevRegistro) => ({
                        ...prevRegistro,
                        [name]: ''
                    }));
                } else {
                    setCustomer({ ...customer, [name]: '' });
                }
                break;
            case 'typedocument':
                setCustomer({ ...customer, typedocument: value, documentcustomer: '' });
                setErrors((prevRegistro) => ({
                    ...prevRegistro,
                    [name]: ''
                }));
                break;
            case 'documentcustomer':
                if (!isNaN(value)) setCustomer({ ...customer, [name]: value.replace(/\s/g, "") });
                setErrors((prevRegistro) => ({
                    ...prevRegistro,
                    [name]: ''
                }));
                break;
            case 'type':
                setCustomer({ ...customer, [name]: value, diaspago: value === 'R' ? 30 : 1 });
                setErrors((prevRegistro) => ({
                    ...prevRegistro,
                    [name]: ''
                }));
                break;
            case 'ejecutivo':
                setCustomer({ ...customer, [name]: checked ? 1 : 0 });
                break;
            case 'diaspago':
                if (value !== '') {
                    const diasPago = parseInt(value);
                    if (!isNaN(diasPago) && diasPago <= 30) {
                        setCustomer({ ...customer, [name]: value });
                    }
                } else {
                    setCustomer({ ...customer, [name]: '' });
                }
                break;
            default:
                setCustomer({ ...customer, [name]: value });
                setErrors((prevRegistro) => ({
                    ...prevRegistro,
                    [name]: ''
                }));
                break;
        }
    }
    // functions apis
    const saveCustomer = async () => {
        const newErrors = {
            typedocument: !customer.typedocument ? 'Este campo es obligatorio' : '',
            namecustomer: !customer.namecustomer ? 'Este campo es obligatorio' : '',
            tradename: !customer.tradename ? 'Este campo es obligatorio' : '',
            documentcustomer: !customer.documentcustomer ? 'Este campo es obligatorio' : '',
            unitprice: !customer.unitprice ? 'Este campo es obligatorio' : '',
            type: !customer.type ? 'Este campo es obligatorio' : ''
        }
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === '')) {
            const response = await fetch(`${Config.URL_BASE}/customer/guardarcustomer.php`, {
                method: 'POST',
                body: JSON.stringify({
                    idcustomer: customer.idcustomer,
                    typedocument: customer.typedocument,
                    documentcustomer: customer.documentcustomer.toUpperCase(),
                    namecustomer: !customer.namecustomer ? '' : customer.namecustomer.toUpperCase(),
                    tradename: !customer.tradename ? '' : customer.tradename.toUpperCase(),
                    unitprice: customer.unitprice,
                    type: customer.type,
                    diaspago: customer.diaspago,
                    ejecutivo: customer.ejecutivo
                })
            });
            const data = await response.json();
            if (data.guardado) {
                Swal.fire(
                    'Guardado!',
                    'Se completo exitosamente.',
                    'success'
                )
                onClose();
                listarCliente();
            }
        }
    }
    const recuperarCustomer = async (idcustomer) => {
        const response = await fetch(`${Config.URL_BASE}/customer/recuperarcustomer.php?idcustomer=${idcustomer}`);
        const data = await response.json();
        setCustomer(data);
    }
    useEffect(() => {
        if (customerObj.idcustomer !== undefined && customerObj.idcustomer !== 0) recuperarCustomer(customerObj.idcustomer);
    }, []);
    return (
        <Grid container spacing={2}>
            <Grid item sm={4} xs={12}>
                <FormControl fullWidth margin="normal" error={errors.typedocument !== ''}>
                    <InputLabel>TIPO DOCUMENTO</InputLabel>
                    <Select
                        value={customer.typedocument}
                        name="typedocument"
                        label="TIPO DOCUMENTO"
                        onChange={handleForm}
                    >
                        <MenuItem value={'RUC'}>RUC</MenuItem>
                        <MenuItem value={'DNI'}>DNI</MenuItem>
                    </Select>
                    <FormHelperText>
                        {errors.typedocument}
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item sm={4} xs={12}>
                <TextField
                    label="NRO DE DOCUMENTO"
                    margin="normal"
                    fullWidth
                    name="documentcustomer"
                    value={customer.documentcustomer}
                    onChange={handleForm}
                    error={errors.documentcustomer !== ''}
                    inputProps={{ maxLength: customer.typedocument === "DNI" ? 8 : 11 }}
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item sm={4} xs={12}>
                <TextField
                    label="PRECIO VENTA"
                    fullWidth
                    margin="normal"
                    name="unitprice"
                    value={customer.unitprice}
                    onChange={handleForm}
                    error={errors.unitprice !== ''}
                    helperText={errors.unitprice}
                    inputProps={{ maxLength: 12 }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="RAZON SOCIAL"
                    margin="normal"
                    fullWidth
                    name="namecustomer"
                    value={customer.namecustomer}
                    onChange={handleForm}
                    error={errors.namecustomer !== ''}
                    helperText={errors.namecustomer}
                    inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 700 }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="NOMBRE COMERCIAL"
                    margin="normal"
                    fullWidth
                    name="tradename"
                    value={customer.tradename !== null ? customer.tradename : ''}
                    onChange={handleForm}
                    error={errors.tradename !== ''}
                    helperText={errors.tradename}
                    inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 500 }}
                />
            </Grid>
            <Grid item sm={4} xs={12}>
                <FormControl fullWidth margin="normal" error={errors.type !== ''}>
                    <InputLabel>TIPO CLIENTE</InputLabel>
                    <Select
                        value={customer.type}
                        name="type"
                        label="TIPO CLIENTE"
                        onChange={handleForm}
                    >
                        <MenuItem value={'R'}>RESTAURANTE</MenuItem>
                        <MenuItem value={'V'}>REVENDEDOR</MenuItem>
                    </Select>
                    <FormHelperText>
                        {errors.type}
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item sm={4} xs={12}>
                <TextField
                    fullWidth
                    label="DIAS PAGO"
                    margin="normal"
                    name="diaspago"
                    value={customer.diaspago}
                    onChange={handleForm}
                    disabled={customer.type === "V"}
                />
            </Grid>
            <Grid item sm={4} xs={12} sx={{ mt: 2, textAlign: 'center' }}>
                <FormControlLabel control={<Switch name="ejecutivo" onChange={handleForm} checked={customer.ejecutivo > 0} />} labelPlacement="start" label="EJECUTIVO DE VENTA" />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button variant="contained" color="success" onClick={saveCustomer}>GUARDAR</Button>
                <Button sx={{ ml: 1 }} onClick={() => onClose()} variant="contained" color="error">CANCELAR</Button>
            </Grid>
        </Grid>
    );
}