import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, Container, Grid, IconButton, InputAdornment, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import Config from '../Config';
import logo from '../assets/logo.png';

export const Login = ({ onLogin }) => {
    const [message, setMessage] = useState({ show: false, type: "warning", message: "", timeout: 3000 });
    const [usernameInput, setUsernameInput] = useState({
        username: '',
        error: false,
        errorText: ''
    });
    const [passwordInput, setPasswordInput] = useState({
        password: '',
        typeInput: 'password',
        error: false,
        errorText: ''
    });
    // functions
    const handleTypeInput = () => {
        passwordInput.typeInput === "password" ?
            setPasswordInput({ ...passwordInput, typeInput: "text" })
            : setPasswordInput({ ...passwordInput, typeInput: "password" });
    }
    const handleInput = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                setUsernameInput({ ...usernameInput, username: value, error: false, errorText: '' });
                break;
            case 'password':
                setPasswordInput({ ...passwordInput, password: value, error: false, errorText: '' });
                break;
        }
    };
    // functions api
    const login = async () => {
        if (usernameInput.username !== "" && passwordInput.password !== "") {
            try {
                const response = await fetch(`${Config.URL_BASE}/user/login.php`, {
                    method: 'POST',
                    body: JSON.stringify({ username: usernameInput.username, password: passwordInput.password })
                });
                const data = await response.json();
                if (data.autorized) {
                    onLogin();
                } else {
                    setMessage({ show: true, type: message.type, message: data.error, timeout: message.timeout });
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            if (usernameInput.username === "") {
                setUsernameInput({ ...usernameInput, error: true, errorText: 'Por favor, el usuario es obligatorio' });
            }
            if (passwordInput.password === "") {
                setPasswordInput({ ...passwordInput, error: true, errorText: 'Por favor, la contraseña es obligatoria' });
            }
        }
    }
    return (
        <Container>
            <Grid container sx={{ height: "98vh", justifyContent: "center", alignContent: "center" }}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    autoHideDuration={message.timeout}
                    onClose={() => setMessage({ show: false, type: message.type, message: message.message, timeout: message.timeout })}
                    open={message.show}
                >
                    <Alert severity={message.type} sx={{ width: '100%' }} variant="filled">
                        {message.message}
                    </Alert>
                </Snackbar>
                <Grid item md={4} sm={6} xs={11}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Control de Facturas y Boletas</Typography>
                        <img src={logo} width={"150px"} height={"150px"}/>
                        <TextField
                            label="USUARIO"
                            fullWidth
                            margin="normal"
                            name="username"
                            value={usernameInput.username}
                            onChange={handleInput}
                            error={usernameInput.error}
                            helperText={usernameInput.errorText}
                        />
                        <TextField
                            type={passwordInput.typeInput}
                            label="CONTRASEÑA"
                            fullWidth
                            margin="normal"
                            name="password"
                            value={passwordInput.password}
                            onChange={handleInput}
                            error={passwordInput.error}
                            helperText={passwordInput.errorText}
                            InputProps={{
                                endAdornment: (<InputAdornment position="end">
                                    <IconButton onClick={handleTypeInput}>
                                        {passwordInput.typeInput === "password" ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>)
                            }}
                        />
                        <Button variant="contained" color="success" onClick={login}>
                            Iniciar Sesion
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}