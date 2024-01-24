import { Grid, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useState } from "react";
import { Facturas } from "./Facturas";
import { Boletas } from "./Boletas";

export const Documents = () => {
    // const toogle button
    const [valorButton, setValorButton] = useState("F");
    // handle toggle button
    const handleChangeToggleButton = (e, newAlignment) => {
        if (newAlignment !== null) setValorButton(newAlignment);
    }
    return (
        <Grid container sx={{ justifyContent: 'center' }}>
            <Grid item xs={12} md={11} sx={{ mt: 3 }}>
                <Grid container>
                    <Grid item xs={12} md={12}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent={"space-between"}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>FACTURAS Y BOLETAS</Typography>
                            <Grid item xs={12} md={2} sx={{ mb: 2, mt: 1 }}>
                                <ToggleButtonGroup
                                    size="small"
                                    color="primary"
                                    value={valorButton}
                                    exclusive
                                    onChange={handleChangeToggleButton}
                                    aria-label="Platform"
                                    fullWidth
                                >
                                    <ToggleButton value="F">FACTURAS</ToggleButton>
                                    <ToggleButton value="B">BOLETAS</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                        </Stack>
                    </Grid>

                    {
                        valorButton === "F" && <Facturas />
                    }
                    {
                        valorButton === "B" && <Boletas />
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}
