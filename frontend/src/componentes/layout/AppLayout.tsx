import { AppBar, Toolbar, Box, Typography, Button, Paper, Container } from '@mui/material'
import type React from 'react';
import { Link as RouterLink } from 'react-router-dom';


type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <Box>
            <AppBar position='static'>
                <Toolbar>
                    <Box>
                        <Typography variant="subtitle2" color='secondary'>GF</Typography>
                    </Box>

                    <Typography component={RouterLink} to="/">GuardianFlux</Typography>

                    <Button component={RouterLink} to="/dashboard" variant='contained' color='success'>Dashboard</Button>
                    <Button component={RouterLink} to="/monitor" variant='outlined' color='error'>Monitor</Button>
                    <Button variant='outlined'>Iniciar sesión</Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="md">
                <Paper>
                    {children}
                </Paper>
            </Container>
        </Box>
    );
};

export default AppLayout;