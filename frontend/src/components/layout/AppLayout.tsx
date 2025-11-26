import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  Container,
} from '@mui/material';
import type React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getAccessToken } from '../../auth/token'; // ajusta la ruta si es distinta

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(getAccessToken());

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        border: '1px solid',
        bgcolor: 'white',
      }}
    >
      <AppBar
        sx={{
          width: '100%',
          height: '70px',
          display: 'flex',
          bgcolor: 'white',
          color: 'black',
          boxShadow: '2',
          justifyContent: 'center',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            minHeight: '40px',
            height: '40px',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mr: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#b31717ff',
                width: 22,
                height: 22,
                fontSize: 11,
              }}
            >
              GF
            </Avatar>
          </Box>

          <Typography
            component={RouterLink}
            to="/"
            color="black"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: 0.5,
              textDecoration: 'none',
              ml: 1,
              mr: 2,
            }}
          >
            GuardianFlux
          </Typography>

          {/* spacer que empuja el bloque de botones a la derecha */}
          <Box
            sx={{
              flexGrow: 1,
            }}
          />

          {/* agrupar botones y añadir espacio entre ellos */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            {/* Dashboard solo si hay sesión */}
            {isAuthenticated && (
              <Button
                component={RouterLink}
                to="/dashboard"
                color="inherit"
                size="small"
                sx={{
                  minWidth: 0,
                  px: 1,
                  fontSize: 15,
                  borderRadius: 1,
                  height: 24,
                }}
              >
                Dashboard
              </Button>
            )}

            {/* Botón de sesión: login / logout */}
            {!isAuthenticated ? (
              <Button
                onClick={handleLoginClick}
                variant="outlined"
                color="primary"
                size="small"
                sx={{
                  minWidth: 0,
                  px: 1,
                  fontSize: 15,
                  borderRadius: 1,
                  height: 24,
                }}
              >
                Iniciar sesión
              </Button>
            ) : (
              <Button
                onClick={handleLogoutClick}
                variant="outlined"
                color="primary"
                size="small"
                sx={{
                  minWidth: 0,
                  px: 1,
                  fontSize: 15,
                  borderRadius: 1,
                  height: 24,
                }}
              >
                Cerrar sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: 1,
          height: 0,
          minHeight: 0,
          marginTop: '90px',
          overflow: 'auto',
          pb: 4,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: { xs: '100%', sm: '90%', md: '75%' },
            maxWidth: 800,
            minHeight: 100,
            p: 3,
            borderRadius: 3,
            borderTop: (theme) =>
              `4px solid ${theme.palette.secondary.main}`,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AppLayout;
