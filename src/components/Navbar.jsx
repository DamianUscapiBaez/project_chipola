import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Assignment, Group, Home, Logout } from "@mui/icons-material";
import Logo from '../assets/logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDolly, faFileInvoice, faPersonDigging } from "@fortawesome/free-solid-svg-icons";
export const Navbar = ({ window, drawerWidth, onLogout }) => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const onLogoutSession = () => {
        onLogout();
        navigate('/');
    }
    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                <Link to="/" style={{ textDecoration: 'none', color: "#000" }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary="INICIO" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                {/* <Link to="/calendario" style={{ textDecoration: 'none', color: "#000" }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <CalendarMonth />
                            </ListItemIcon>
                            <ListItemText primary="CALENDARIO" />
                        </ListItemButton>
                    </ListItem>
                </Link> */}
                <Link to="/cosechas" style={{ textDecoration: 'none', color: "#000" }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <FontAwesomeIcon style={{ width: 24, height: 24 }} icon={faPersonDigging} />
                            </ListItemIcon>
                            <ListItemText primary="COSECHAS" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link to="/guias" style={{ textDecoration: 'none', color: "#000" }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Assignment />
                            </ListItemIcon>
                            <ListItemText primary="GUIAS" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <Link to="/documentos" style={{ textDecoration: 'none', color: "#000" }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <FontAwesomeIcon icon={faFileInvoice} style={{ width: 24, height: 24 }} />
                            </ListItemIcon>
                            <ListItemText primary="FACTURAS & BOLETAS" />
                        </ListItemButton>
                    </ListItem>
                </Link>
                {/* <Link to="/despachos" style={{ textDecoration: 'none', color: "#000" }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <FontAwesomeIcon style={{ width: 24, height: 24 }} icon={faDolly} />
                            </ListItemIcon>
                            <ListItemText primary="DESPACHO" />
                        </ListItemButton>
                    </ListItem>
                </Link> */}
                <Link to="/clientes" style={{ textDecoration: 'none', color: "#000" }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Group />
                            </ListItemIcon>
                            <ListItemText primary="CLIENTES" />
                        </ListItemButton>
                    </ListItem>
                </Link>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => onLogoutSession()}>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="SALIR" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <Box>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: "#2a8038"
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img src={Logo} width={40} height={40} style={{ marginLeft: 2, marginRight: 10 }} />
                    <Typography variant="h6" noWrap component="div">
                        CONTROL DE FACTURAS Y BOLETAS
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth
                        }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth
                        }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}