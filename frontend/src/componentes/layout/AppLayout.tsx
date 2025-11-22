import { AppBar, Toolbar, Box, Typography, Avatar, Button, Paper, Container } from '@mui/material'
import { deepOrange } from '@mui/material/colors';
import type React from 'react';
import { Link as RouterLink } from 'react-router-dom';


type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <Box sx={{ borderRadius: 2, bgcolor: 'white' }}>
            <AppBar position='static' sx={{ bgcolor: 'white', color: 'black' }} >
                <Toolbar>
                    <Box sx={{ mr: 1 }}>
                        <Avatar sx={{ bgcolor: deepOrange[500] }}>GF</Avatar>
                    </Box>

                    <Typography component={RouterLink} to="/" color='black' sx={{ textDecoration: 'none', color: 'inherit', ml: 1 }}>
                        GuardianFlux
                    </Typography>

                    {/* spacer que empuja el bloque de botones a la derecha */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* agrupar botones y añadir espacio entre ellos */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button component={RouterLink} to="/dashboard" color='inherit'>Dashboard</Button>
                        <Button component={RouterLink} to="/monitor" color='inherit'>Monitor</Button>
                        <Button variant='outlined' color='inherit'>Iniciar sesión</Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container sx={{ boxShadow: 5 }}>
                <Paper>
                    {children}
                </Paper>
            </Container>

        </Box>
    );
};

export default AppLayout;