/* eslint-disable react/prop-types */
import { Autocomplete, Button, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import Swal from "sweetalert2";
import { Delete } from "@mui/icons-material";

export const NewDocuments = ({ onCloseDlg, listarDocuments, documentDlg }) => {
    const fecha = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    const [customerSelect, setCustomerSelect] = useState({
        idcustomer: 0,
        namecustomer: "",
        tradename: "",
        unitprice: "",
        diaspago: ""
    });
    const [registro, setRegistro] = useState({
        iddocument: 0,
        typedocument: "",
        numero: "",
        fecha: fecha,
        fechavencimiento: '',
        idcustomer: "",
        monto: '',
        kilos: '',
        numeroperacion: '',
        fechapago: '',
        montopago: '',
        numeroperacion2: '',
        fechapago2: '',
        montopago2: '',
        statusdetraccion: 0,
        detraccion: '',
        estado: "PEN",
        fechadetraccion: '',
        numerodetraccion: '',
        pagodetraccion: ''
    });
    const [guiaSelect, setGuiaSelect] = useState({
        idguia: 0,
        guia: '',
        nroguia: '',
        fecha: '',
        namecustomer: '',
        tradename: '',
        kilos: '',
        idcustomer: 0
    });
    // Validation
    const [errors, setErrors] = useState({
        typedocument: '',
        numero: '',
        fecha: '',
        idcustomer: '',
        monto: '',
        kilos: '',
        numeroperacion: '',
        fechapago: '',
        montopago: '',
        preciounit: ''
    });
    const [guiasRegister, setGuiasRegister] = useState([]);
    const [totalPeso, setTotalPeso] = useState(0);
    const [guias, setGuias] = useState([]);
    const detraccionValor = 0.015;

    const redondearDetraccion = (monto, detraccionValor, permitirDetraccion) => {
        if (monto > 700 || permitirDetraccion) {
            let resultadoMultiplicacion = monto * detraccionValor;
            let redondeado = Math.round(resultadoMultiplicacion * 100) / 100;

            redondeado = Math.round(redondeado * 10) / 10; // Redondear a múltiplo de 0.10

            let parteDecimal = redondeado - Math.trunc(redondeado);

            if (parteDecimal >= 0.5) {
                redondeado = Math.ceil(redondeado);
            } else if (parteDecimal <= 0.1) {
                redondeado = Math.floor(redondeado);
            }
            return redondeado;
        } else {
            return 0;
        }
    };
    // console.log(customerSelect);
    // const handleForm = (e) => {
    //     const { name, value, checked } = e.target;

    //     const updateRegistro = (changes) => setRegistro(prevRegistro => ({ ...prevRegistro, ...changes }));
    //     const updateErrors = (changes) => setErrors(prevRegistro => ({ ...prevRegistro, ...changes }));

    //     switch (name) {
    //         case 'kilos':
    //             if (value !== '') {
    //                 if (!isNaN(value) && /^\d+(\.\d{0,3})?$/.test(value)) {
    //                     const kilos = name === 'kilos' ? parseFloat(value).toFixed(3) : undefined;
    //                     const montototal = (parseFloat(customerSelect.unitprice) * kilos).toFixed(2);
    //                     if (kilos !== undefined) {
    //                         const mensaje = kilos !== totalPeso.toFixed(3)
    //                             ? kilos < totalPeso.toFixed(3)
    //                                 ? 'El peso debe ser igual al peso total de las guías.'
    //                                 : 'El peso debe ser igual al peso total de las guías.'
    //                             : '';
    //                         updateRegistro({
    //                             [name]: value,
    //                             monto: montototal,
    //                             statusdetraccion: montototal > 700 ? 1 : 0,
    //                             detraccion: redondearDetraccion(montototal, detraccionValor)
    //                         });
    //                         updateErrors({ [name]: mensaje });
    //                     } else {
    //                         updateRegistro({ [name]: value });
    //                         updateErrors({ [name]: '' });
    //                     }
    //                 }
    //             } else {
    //                 updateRegistro({ [name]: '' });
    //                 updateErrors({ [name]: '' });
    //             }
    //             break;
    //         case 'monto':
    //             if (value !== '') {
    //                 if (!isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
    //                     setRegistro({ ...registro, [name]: value, statusdetraccion: value > 700 ? 1 : 0, detraccion: redondearDetraccion(value, detraccionValor) });
    //                 } else {
    //                     setErrors((prevRegistro) => ({
    //                         ...prevRegistro,
    //                         [name]: '',
    //                     }));
    //                 }
    //             } else {
    //                 setRegistro({ ...registro, [name]: '' });
    //                 setErrors((prevRegistro) => ({
    //                     ...prevRegistro,
    //                     [name]: '',
    //                 }));
    //             }
    //             break;

    //         case 'detraccion':
    //             if (value !== "") {
    //                 if (!isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
    //                     updateRegistro({ detraccion: value });
    //                 }
    //             } else {
    //                 updateRegistro({ [name]: '', pagodetraccion: '' });
    //             }
    //             break;

    //         case 'pagodetraccion':
    //             if (value !== '') {
    //                 if (!isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
    //                     const montopago = parseFloat(registro.montopago);
    //                     const montopago2 = parseFloat(registro.montopago2);
    //                     const montoTotal = parseFloat(registro.monto);

    //                     if (montopago + montopago2 >= montoTotal) {
    //                         updateRegistro({ [name]: '0' });
    //                     } else if (parseFloat(value) <= registro.detraccion) {
    //                         updateRegistro({ [name]: value });
    //                     }
    //                 }
    //             } else {
    //                 updateRegistro({ [name]: '' });
    //             }
    //             break;

    //         case 'montopago':
    //             if (value !== "") {
    //                 if (!isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
    //                     const monto = parseFloat(registro.monto);
    //                     const montopago = parseFloat(value);

    //                     if (montopago < monto) {
    //                         setRegistro(prevRegistro => ({
    //                             ...prevRegistro,
    //                             [name]: value,
    //                             pagodetraccion: 0  // Si montopago es menor, se establece detraccion a 0
    //                         }));
    //                     } else if (montopago === monto) {
    //                         setRegistro(prevRegistro => ({
    //                             ...prevRegistro,
    //                             [name]: value,
    //                             pagodetraccion: 0
    //                         }));
    //                     }
    //                     setErrors(prevErrors => ({
    //                         ...prevErrors,
    //                         [name]: ''
    //                     }));
    //                 } else {
    //                     setRegistro(prevRegistro => ({ ...prevRegistro, [name]: '' }));
    //                 }
    //             } else {
    //                 setRegistro(prevRegistro => ({ ...prevRegistro, [name]: '', pagodetraccion: 0 }));
    //                 setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    //             }
    //             break;
    //         case 'montopago2':
    //             if (value !== "") {
    //                 if (!isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
    //                     const monto = parseFloat(registro.monto);
    //                     const montopago = parseFloat(registro.montopago);
    //                     const montopago2 = parseFloat(value);

    //                     setRegistro((prevRegistro) => {
    //                         const newRegistro = { ...prevRegistro, [name]: value };

    //                         if (montopago + montopago2 >= monto) {
    //                             newRegistro.pagodetraccion = 0;
    //                         }

    //                         return newRegistro;
    //                     });
    //                 }
    //                 setErrors((prevRegistro) => ({
    //                     ...prevRegistro,
    //                     [name]: ''
    //                 }));
    //             } else {
    //                 setRegistro({ ...registro, [name]: '' });
    //             }
    //             break;
    //         case 'estado':
    //             if (value === "PAG") {
    //                 updateRegistro({ estado: value, fechapago: fecha, fechapago2: fecha });
    //             } else {
    //                 updateRegistro({ estado: value, fechapago: '' });
    //             }
    //             break;

    //         case 'statusdetraccion':
    //             updateRegistro({
    //                 statusdetraccion: checked ? 1 : 0,
    //                 detraccion: checked ? redondearDetraccion(registro.monto, detraccionValor, checked) : "",
    //                 pagodetraccion: ''
    //             });
    //             break;

    //         default:
    //             if (value !== "") {
    //                 updateErrors({ [name]: '' });
    //             }
    //             updateRegistro({ [name]: value });
    //             break;
    //     }
    // };
    const handleForm = (e) => {
        const { name, value, checked } = e.target;

        const updateRegistro = (changes) => setRegistro(prevRegistro => ({ ...prevRegistro, ...changes }));
        const updateErrors = (changes) => setErrors(prevRegistro => ({ ...prevRegistro, ...changes }));

        switch (name) {
            case 'kilos':
                if (value !== '' && !isNaN(value) && /^\d+(\.\d{0,3})?$/.test(value)) {
                    const kilos = parseFloat(value).toFixed(3);
                    const montototal = (parseFloat(customerSelect.unitprice) * kilos).toFixed(2);
                    const mensaje = kilos !== totalPeso.toFixed(3) ? 'El peso debe ser igual al peso total de las guías.' : '';
                    updateRegistro({ [name]: value, monto: montototal, statusdetraccion: montototal > 700 ? 1 : 0, detraccion: redondearDetraccion(montototal, detraccionValor) });
                    updateErrors({ [name]: mensaje });
                } else {
                    updateRegistro({ [name]: '', monto: '', ...value !== '' && { [name]: '' } });
                    updateErrors({ [name]: value !== '' ? 'Ingrese un valor numérico válido.' : '' });
                }
                break;

            case 'monto':
                if (value !== '' && !isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
                    updateRegistro({ [name]: value, statusdetraccion: value > 700 ? 1 : 0, detraccion: redondearDetraccion(value, detraccionValor) });
                } else {
                    updateRegistro({ [name]: '', ...value !== '' && { [name]: '' } });
                    updateErrors({ [name]: '' });
                }
                break;

            case 'detraccion':
                if (value !== '' && !isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
                    updateRegistro({ detraccion: value });
                } else {
                    updateRegistro({ [name]: '', pagodetraccion: '' });
                }
                break;

            case 'pagodetraccion':
                if (value !== '' && !isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
                    const montopago = parseFloat(registro.montopago);
                    const montopago2 = parseFloat(registro.montopago2);
                    const montoTotal = parseFloat(registro.monto);
                    updateRegistro({ [name]: montopago + montopago2 >= montoTotal ? '0' : value });
                } else {
                    updateRegistro({ [name]: '' });
                }
                break;

            case 'montopago':
            case 'montopago2':
                if (value !== '' && !isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
                    const monto = parseFloat(registro.monto);
                    const montopago = parseFloat(value);
                    const pagodetraccion = montopago < monto || montopago === monto ? '0' : undefined;
                    updateRegistro({ [name]: value, pagodetraccion });
                    updateErrors({ [name]: '' });
                } else {
                    updateRegistro({ [name]: '', pagodetraccion: '0', ...value !== '' && { [name]: '' } });
                }
                break;

            case 'estado':
                const newState = value === 'PAG'
                    ? { estado: value, fechapago: fecha, fechapago2: fecha }
                    : { estado: value, fechapago: '', fechapago2: '' };

                updateRegistro(newState);
                break;

            case 'statusdetraccion':
                updateRegistro({ statusdetraccion: checked ? 1 : 0, detraccion: checked ? redondearDetraccion(registro.monto, detraccionValor, checked) : '', pagodetraccion: '' });
                break;

            default:
                if (value !== "") {
                    updateErrors({ [name]: '' });
                }
                updateRegistro({ [name]: value });
                break;
        }
    };

    const handleAutocompleteGuia = (e, values) => {
        const resetValues = {
            idcustomer: 0,
            namecustomer: '',
            tradename: '',
            unitprice: ''
        };

        if (values !== null) {
            setCustomerSelect({
                idcustomer: values.idcustomer,
                namecustomer: values.namecustomer,
                tradename: values.tradename,
                unitprice: values.unitprice,
                diaspago: values.diaspago
            });
            setRegistro(prevRegistro => ({ ...prevRegistro, idcustomer: values.idcustomer }));
            setErrors(prevErrors => ({ ...prevErrors, idcustomer: '' }));
            setGuiaSelect(values);
        } else {
            setCustomerSelect(resetValues);
            setGuiaSelect({ idguia: 0, guia: '', nroguia: '', fecha: '', namecustomer: '', kilos: '', idcustomer: 0 });
            setRegistro(prevRegistro => ({ ...prevRegistro, idcustomer: 0 }));
        }
    };

    const handleFormPrecio = (e) => {
        const { value } = e.target;
        if (value !== "" && !isNaN(value) && /^\d+(\.\d{0,2})?$/.test(value)) {
            const monto = registro.kilos * value;
            setCustomerSelect({ ...customerSelect, unitprice: value });
            setRegistro({
                ...registro,
                monto,
                statusdetraccion: monto > 700 ? 1 : 0,
                detraccion: redondearDetraccion(monto, detraccionValor),
                fechadetraccion: monto > 700 ? fecha : ''
            });
            setErrors((prevRegistro) => ({ ...prevRegistro, preciounit: '' }));
        } else {
            setCustomerSelect({ ...customerSelect, unitprice: '' });
            setRegistro({ ...registro, monto: 0, detraccion: 0, fechadetraccion: '' });
            setErrors((prevRegistro) => ({ ...prevRegistro, preciounit: value !== '' ? 'Ingrese un valor numérico válido.' : '' }));
        }
    };

    // functions
    const addGuia = () => {
        const { idguia, idcustomer } = guiaSelect;

        if (idguia > 0 && idcustomer === customerSelect.idcustomer) {
            const exists = guiasRegister.some((guia) => guia.idguia === idguia);

            if (!exists) {
                const updatedGuiasRegister = [...guiasRegister, guiaSelect];
                const totalKilos = updatedGuiasRegister.reduce((total, guia) => total + parseFloat(guia.kilos), 0);

                setGuiasRegister(updatedGuiasRegister);
                setTotalPeso(totalKilos);
                const monto = (totalKilos * customerSelect.unitprice).toFixed(2);

                const detraccion = monto > 700 ? redondearDetraccion(monto, detraccionValor) : 0;

                setRegistro({ ...registro, kilos: totalKilos, monto, statusdetraccion: monto > 700 ? 1 : 0, detraccion });
                setGuiaSelect({
                    idguia: 0,
                    guia: '',
                    nroguia: '',
                    fecha: '',
                    namecustomer: '',
                    tradename: '',
                    kilos: '',
                    idcustomer: 0
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Guía agregada correctamente',
                    showConfirmButton: false,
                    timer: 2000
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'No se puede agregar la guía',
                    text: 'La guía ya ha sido registrada anteriormente.',
                });
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: 'No se puede agregar la guía',
                text: 'La guía no pertenece al mismo cliente.',
            });
        }
    };

    const deleteGuia = (guiaobj) => {
        Swal.fire({
            title: '¿Estás seguro de eliminar?',
            text: '¡Esta acción no podrá ser revertida!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                const guiaIndex = guiasRegister.findIndex((guia) => guia.idguia === guiaobj.idguia);

                if (guiaIndex !== -1) {
                    const guiaEliminada = guiasRegister[guiaIndex];
                    const pesoEliminado = parseFloat(guiaEliminada.kilos);

                    const totalPesoActualizado = totalPeso - pesoEliminado;
                    const monto = (totalPesoActualizado * customerSelect.unitprice).toFixed(2);

                    const newStatusDetraccion = monto > 700 ? 1 : 0;
                    const detraccionAmount = newStatusDetraccion ? Math.ceil(monto * detraccionValor) : 0;

                    const updatedGuiasRegister = guiasRegister.filter((_, index) => index !== guiaIndex);

                    setGuiasRegister(updatedGuiasRegister);
                    setTotalPeso(totalPesoActualizado);

                    setRegistro({
                        ...registro,
                        kilos: totalPesoActualizado.toFixed(3),
                        monto,
                        statusdetraccion: newStatusDetraccion,
                        detraccion: detraccionAmount,
                        idcustomer: 0
                    });

                    Swal.fire('Eliminado', 'Se eliminó la guía exitosamente.', 'success');
                }
            }

            if (result.isConfirmed) {
                setCustomerSelect({
                    idcustomer: 0,
                    namecustomer: "",
                    tradename: "",
                    unitprice: "",
                    diaspago: ""
                });

                setGuiaSelect({
                    idguia: 0,
                    guia: '',
                    nroguia: '',
                    fecha: '',
                    namecustomer: '',
                    kilos: '',
                    idcustomer: 0
                });
            }
        });
    };
    // functions apis
    const fetchData = async () => {
        const responseGuias = await fetch(`${Config.URL_BASE}/guide/listarguiasinregistro.php`);
        const guiasData = await responseGuias.json();
        setGuias(guiasData);
    };

    const saveRegistro = async () => {
        const { typedocument, numero, fecha, idcustomer, monto, kilos, numeroperacion, fechapago, montopago } = registro;

        const newErrors = {
            typedocument: !typedocument ? 'Este campo es obligatorio' : '',
            numero: !numero ? 'Este campo es obligatorio' : '',
            fecha: !fecha ? 'Este campo es obligatorio' : '',
            idcustomer: !idcustomer ? 'Este campo es obligatorio' : '',
            monto: !monto ? 'Este campo es obligatorio' : '',
            kilos: !kilos ? 'Este campo es obligatorio' : '',
            numeroperacion: registro.estado === 'PAG' && !numeroperacion ? 'Este campo es obligatorio' : '',
            fechapago: registro.estado === 'PAG' && !fechapago ? 'Este campo es obligatorio' : '',
            montopago: registro.estado === 'PAG' && !montopago ? 'Este campo es obligatorio' : '',
            preciounit: !customerSelect.unitprice ? 'Este campo es obligatorio' : ''
        };
        setErrors(newErrors);

        if (Object.values(newErrors).every(error => error === '')) {

            var fechaInicial = new Date(fecha); // Puedes inicializar con la fecha que desees
            var diasASumar = parseInt(customerSelect.diaspago);

            var fechaVencimiento = new Date(fechaInicial.getTime() + diasASumar * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

            const response = await fetch(`${Config.URL_BASE}/register/guardarregister.php`, {
                method: 'POST',
                body: JSON.stringify({
                    iddocument: registro.iddocument,
                    typedocument: typedocument,
                    numero: numero.replace(/\s+/g, '').toUpperCase(),
                    fecha: fecha,
                    fechavencimiento: fechaVencimiento,
                    idcustomer: idcustomer,
                    monto: monto,
                    numeroperacion: !numeroperacion ? '' : numeroperacion.toUpperCase(),
                    fechapago: fechapago,
                    montopago: montopago,
                    kilos: kilos,
                    estado: registro.estado,
                    fechapago2: registro.fechapago2,
                    montopago2: registro.montopago2,
                    numeroperacion2: !registro.numeroperacion2 ? '' : registro.numeroperacion2.toUpperCase(),
                    detraccion: registro.detraccion,
                    fechadetraccion: registro.fechadetraccion,
                    numerodetraccion: !registro.numerodetraccion ? '' : registro.numerodetraccion.toUpperCase(),
                    pagodetraccion: registro.pagodetraccion
                })
            });

            const data = await response.json();

            if (data.guardado) {
                if (registro.iddocument > 0) {
                    await fetch(`${Config.URL_BASE}/register/eliminartodoregisterguide.php?iddocument=${data.codigo}`);
                }

                guiasRegister.forEach(async guia => {
                    await fetch(`${Config.URL_BASE}/register/guardarregisterguide.php`, {
                        method: 'POST',
                        body: JSON.stringify({ iddocument: data.codigo, idguia: guia.idguia })
                    });
                });

                Swal.fire('Guardado!', 'Se completó exitosamente.', 'success');
                onCloseDlg();
                listarDocuments();
            } else if (data.existe) {
                Swal.fire("Error", "El número de Factura o Boleta ya existe.", "error");
            } else {
                Swal.fire('Error', 'Hubo un problema al guardar la guía.', 'error');
            }
        }
    };


    useEffect(() => {
        const recuperarRegistro = async (iddocument) => {
            try {
                const response = await fetch(`${Config.URL_BASE}/register/recuperarregister.php?iddocument=${iddocument}`);
                const data = await response.json();

                const responseGuias = await fetch(`${Config.URL_BASE}/register/listarregisterguide.php?iddocument=${iddocument}`);
                const dataGuias = await responseGuias.json();

                const responseCustomer = await fetch(`${Config.URL_BASE}/customer/recuperarcustomer.php?idcustomer=${data.idcustomer}`);
                const dataCustomer = await responseCustomer.json();

                setRegistro({
                    iddocument: data.iddocument,
                    typedocument: data.typedocument,
                    numero: data.numero,
                    fecha: data.fecha,
                    idcustomer: data.idcustomer,
                    monto: data.monto,
                    kilos: data.kilos,
                    numeroperacion: data.numeroperacion,
                    fechapago: data.fechapago,
                    montopago: data.montopago,
                    numeroperacion2: data.numeroperacion2,
                    fechapago2: data.fechapago2,
                    montopago2: data.montopago2,
                    statusdetraccion: data.detraccion > 0 ? 1 : 0,
                    detraccion: data.detraccion,
                    estado: data.estado,
                    fechadetraccion: data.fechadetraccion,
                    numerodetraccion: data.numerodetraccion,
                    pagodetraccion: data.pagodetraccion
                });

                setCustomerSelect(dataCustomer);
                setGuiasRegister(dataGuias);

                const totalKilos = dataGuias.map(guia => parseFloat(guia.kilos)).reduce((total, kilos) => total + kilos, 0);
                setTotalPeso(totalKilos);

            } catch (error) {
                console.error("Error al recuperar registro:", error);
            }
        };

        if (documentDlg.idregistro !== undefined && documentDlg.idregistro > 0) recuperarRegistro(documentDlg.idregistro);
        fetchData();
    }, []);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth margin="dense" error={!!errors.typedocument}>
                            <InputLabel>TIPO DE DOCUMENTO</InputLabel>
                            <Select
                                name="typedocument"
                                value={registro.typedocument}
                                onChange={handleForm}
                                label="TIPO DE DOCUMENTO"
                            >
                                <MenuItem value="F">FACTURA</MenuItem>
                                <MenuItem value="B">BOLETA</MenuItem>
                            </Select>
                            <FormHelperText>
                                {errors.typedocument}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="NUMERO"
                            name="numero"
                            value={registro.numero}
                            onChange={handleForm}
                            error={!!errors.numero}
                            helperText={errors.numero}
                            fullWidth
                            margin="dense"
                            inputProps={{ style: { textTransform: 'uppercase' }, maxLength: 20 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="FECHA"
                            name="fecha"
                            type="date"
                            value={registro.fecha}
                            onChange={handleForm}
                            error={!!errors.fecha}
                            helperText={errors.fecha}
                            fullWidth
                            margin="dense"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="CLIENTE"
                            fullWidth
                            margin="dense"
                            disabled
                            value={customerSelect.namecustomer}
                            error={!!errors.idcustomer}
                            helperText={errors.idcustomer}
                        />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <TextField
                            label="NOMBRE COMERCIAL"
                            fullWidth
                            margin="dense"
                            disabled
                            value={customerSelect.tradename}
                        />
                    </Grid>
                    <Grid item sm={3}>
                        <FormControlLabel
                            value="top"
                            control={<Switch color="primary" name="statusdetraccion" onChange={handleForm} disabled={!customerSelect.idcustomer > 0} checked={registro.statusdetraccion > 0} />}
                            label="DETRACCION"
                            labelPlacement="top"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="PRECIO VENTA"
                            name="unitprice"
                            value={customerSelect.unitprice}
                            onChange={handleFormPrecio}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ maxLength: 12 }}
                            fullWidth
                            error={!!errors.preciounit}
                            helperText={errors.preciounit}
                            disabled={!customerSelect.idcustomer > 0}
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="PESO"
                            name="kilos"
                            value={registro.kilos}
                            onChange={handleForm}
                            error={!!errors.kilos}
                            helperText={errors.kilos}
                            inputProps={{ maxLength: 12 }}
                            fullWidth
                            disabled={!customerSelect.idcustomer > 0}
                            InputLabelProps={{ shrink: true }}
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            label="MONTO"
                            name="monto"
                            value={registro.monto}
                            onChange={handleForm}
                            error={!!errors.monto}
                            helperText={errors.monto}
                            fullWidth
                            margin="dense"
                            inputProps={{ maxLength: 10 }}
                            disabled={!customerSelect.idcustomer > 0}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth margin="dense">
                            <InputLabel>ESTADO</InputLabel>
                            <Select
                                label="ESTADO"
                                name="estado"
                                value={registro.estado}
                                onChange={handleForm}
                            >
                                <MenuItem value="PEN">PENDIENTE</MenuItem>
                                <MenuItem value="PAG">PAGADO</MenuItem>
                                <MenuItem value="ANU">ANULADO</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {
                        registro.estado === "PAG" &&
                        <>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="FECHA PAGO"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    name="fechapago"
                                    value={!registro.fechapago ? '' : registro.fechapago}
                                    onChange={handleForm}
                                    error={!!errors.fechapago}
                                    helperText={errors.fechapago}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="NRO OPERACION"
                                    name="numeroperacion"
                                    InputLabelProps={{ shrink: true }}
                                    value={!registro.numeroperacion ? '' : registro.numeroperacion}
                                    onChange={handleForm}
                                    error={!!errors.numeroperacion}
                                    helperText={errors.numeroperacion}
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="MONTO PAGADO"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ maxLength: 12 }}
                                    name="montopago"
                                    value={!registro.montopago ? '' : registro.montopago}
                                    onChange={handleForm}
                                    error={!!errors.montopago}
                                    helperText={errors.montopago}
                                    disabled={!registro.monto}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="FECHA PAGO 2"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    name="fechapago2"
                                    value={!registro.fechapago2 ? '' : registro.fechapago2}
                                    onChange={handleForm}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="NRO OPERACION 2"
                                    name="numeroperacion2"
                                    InputLabelProps={{ shrink: true }}
                                    value={!registro.numeroperacion2 ? '' : registro.numeroperacion2}
                                    onChange={handleForm}
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                    margin="dense"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="MONTO PAGADO 2"
                                    inputProps={{ maxLength: 12 }}
                                    name="montopago2"
                                    InputLabelProps={{ shrink: true }}
                                    value={!registro.montopago2 ? '' : registro.montopago2}
                                    onChange={handleForm}
                                    margin="dense"
                                />
                            </Grid>
                        </>
                    }
                    {
                        registro.statusdetraccion > 0 &&
                        <>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    label="DETRACCION"
                                    name="detraccion"
                                    value={registro.detraccion}
                                    onChange={handleForm}
                                    margin="dense"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    fullWidth
                                    label="FECHA DETRACCION"
                                    margin="dense"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    name="fechadetraccion"
                                    value={registro.fechadetraccion !== null ? registro.fechadetraccion : ''}
                                    onChange={handleForm}
                                />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    fullWidth
                                    label="NUMERO OPERACION DETRACCION"
                                    margin="dense"
                                    name="numerodetraccion"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ maxLength: 45, style: { textTransform: 'uppercase' } }}
                                    value={registro.numerodetraccion !== null ? registro.numerodetraccion : ''}
                                    onChange={handleForm}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    label="MONTO PAGO DETRACCION"
                                    margin="dense"
                                    name="pagodetraccion"
                                    InputLabelProps={{ shrink: true }}
                                    value={registro.pagodetraccion !== null ? registro.pagodetraccion : ''}
                                    onChange={handleForm}
                                    inputProps={{ maxLength: 12 }}
                                    disabled={registro.detraccion === ""}
                                />
                            </Grid>
                        </>
                    }
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>GUIAS</Typography>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Autocomplete
                            id="list-customer"
                            onChange={handleAutocompleteGuia}
                            options={guias}
                            value={guiaSelect}
                            getOptionLabel={(option) => option.guia}
                            renderInput={(params) => <TextField {...params} fullWidth label="GUIAS" size="small" margin="normal" />}
                        />
                    </Grid>
                    <Grid item md={3} sx={{ mt: 2 }}>
                        <Button color="success" fullWidth variant="contained" onClick={addGuia}>AGREGAR</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bold' }}>NRO GUIA</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>CLIENTE</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>NOMBRE COMERCIAL</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>FECHA</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>KILOS</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {guiasRegister.map((guia) => (
                                        <TableRow key={guia.idguia}>
                                            <TableCell>{guia.nroguia}</TableCell>
                                            <TableCell>{guia.namecustomer}</TableCell>
                                            <TableCell>{guia.tradename}</TableCell>
                                            <TableCell>{guia.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</TableCell>
                                            <TableCell>{guia.kilos}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="ELIMINAR GUIA" placement="top">
                                                    <IconButton size="small" onClick={() => deleteGuia(guia)}>
                                                        <Delete fontSize="small" color="error" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {
                                        guiasRegister.length === 0 &&
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">NO HAY REGISTROS DISPONIBLES</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button variant="contained" color="success" onClick={saveRegistro}>GUARDAR</Button>
                <Button sx={{ ml: 1 }} onClick={() => onCloseDlg()} variant="contained" color="error">CANCELAR</Button>
            </Grid>
        </Grid >
    );
};