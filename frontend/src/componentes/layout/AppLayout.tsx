import { AppBar, Toolbar, Box, Typography, Avatar, Button, Paper, Container } from '@mui/material'
import { deepOrange } from '@mui/material/colors';
import type React from 'react';
import { Link as RouterLink } from 'react-router-dom';


type AppLayoutProps = {
    children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexFlow: "column",
                width: "100%",
                height: "100vh",
                border: "1px solid",
                bgcolor: 'white'
            }}>
            <AppBar
                sx={{
                    display: 'flex',
                    bgcolor: 'white',
                    color: 'black',
                    boxShadow: 5,
                    justifyContent: 'center',
                    height: '40px'
                }}>
                <Toolbar
                    sx={{
                        display: "flex",
                        alignItems: 'center',
                        padding: '0 12px',
                        minHeight: '40px',
                        height: '40px',
                        gap: 1
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 1
                        }}>

                        <Avatar
                            sx={{
                                bgcolor: deepOrange[500],
                                width: 22,
                                height: 22,
                                fontSize: 11
                            }}>
                            GF
                        </Avatar>
                    </Box>

                    <Typography
                        component={RouterLink}
                        to="/"
                        color='black'

                        sx={{
                            display: "flex",
                            alignItems: 'center',
                            fontWeight: 500,
                            fontSize: 14,
                            letterSpacing: 0.5,
                            ml: 1,
                            mr: 2,
                        }}>
                        GuardianFlux
                    </Typography>

                    {/* spacer que empuja el bloque de botones a la derecha */}
                    <Box
                        sx={{
                            flexGrow: 1,
                        }} />

                    {/* agrupar botones y añadir espacio entre ellos */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                        }}>

                        <Button
                            component={RouterLink}
                            to="/dashboard"
                            color='inherit'
                            size="small"
                            sx={{
                                minWidth: 0,
                                px: 1,
                                fontSize: 11,
                                borderRadius: 1,
                                height: 24
                            }}>
                            Dashboard
                        </Button>

                        <Button
                            component={RouterLink}
                            to="/monitor"
                            color='inherit'
                            size="small"
                            sx={{
                                minWidth: 0,
                                px: 1,
                                fontSize: 11,
                                borderRadius: 1,
                                height: 24
                            }}>
                            Monitor
                        </Button>
                        <Button
                            variant='outlined'
                            color='inherit'
                            size="small"
                            sx={{
                                minWidth: 0,
                                px: 1,
                                fontSize: 11,
                                borderRadius: 1,
                                height: 24
                            }}>
                            Iniciar sesión
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md" 
                sx={{ 
                    display: 'flex', 
                    flexGrow: 1, 
                    alignItems: 'center', 
                    justiftyContent: 'center',
                    py: 4 
                }}>
                <Paper          
                elevation={2}
                sx={{
                p: 3,
                borderRadius: 3,
                borderTop: (theme) => `4px solid ${theme.palette.secondary.main}`,
                }}>
                    {children}
                </Paper>
            </Container>

        </Box >
    );
};

export default AppLayout;