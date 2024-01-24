import { Route, Routes } from "react-router-dom";
import { Home } from './Home';
import { Guias } from "./guias/Guias";
import { Customers } from "./customers/Customers";
import { Box } from "@mui/material";
import { Navbar } from "./Navbar";
import { Documents } from "./documents/Documents";
import { Cosechas } from "./cosecha/Cosechas";
import { NotFount } from "../NotFount";
import { Despachos } from "./despacho/Despachos";
const drawerWidth = 240;

export const RoutesComponents = ({ onLogout }) => {
    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <Navbar drawerWidth={drawerWidth} onLogout={onLogout} />
                <Box component="main"
                    sx={{
                        flexGrow: 1,
                        mt: 7,
                        width: { sm: `calc(100% - ${drawerWidth}px)` }
                    }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/documentos" exact element={<Documents />} />
                        <Route path="/clientes" exact element={<Customers />} />
                        <Route path="/guias" exact element={<Guias />} />
                        <Route path="/cosechas" exact element={<Cosechas />} />
                        {/* <Route path="/despachos" exact element={<Despachos />} /> */}

                        {/* Ruta para manejar rutas no existentes */}
                        <Route path="*" element={<NotFount />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
}