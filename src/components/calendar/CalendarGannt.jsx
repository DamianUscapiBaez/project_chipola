import { AddCircleOutline, Close } from "@mui/icons-material";
import { Button, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { NewCalendario } from "./NewCalendario";

export const CalendarGannt = () => {
    // constantes
    const [dlgNewCalendar, setDlgNewCalendar] = useState(false);
    return (
        <Container>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12}>
                    <Stack direction={'row'} justifyContent={"space-between"}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>CALENDARIO</Typography>
                        <Button
                            size="small"
                            color="success"
                            variant="contained"
                            startIcon={<AddCircleOutline />}
                            onClick={() => setDlgNewCalendar(true)}
                        >
                            NUEVO
                        </Button>
                    </Stack>
                </Grid>
                <Dialog open={dlgNewCalendar}>
                    <DialogTitle>
                        NUEVO DIAGRAMA
                        <IconButton
                            aria-label="close"
                            onClick={() => setDlgNewCalendar(false)}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <NewCalendario />
                    </DialogContent>
                </Dialog>
            </Grid>
        </Container>
    );
}