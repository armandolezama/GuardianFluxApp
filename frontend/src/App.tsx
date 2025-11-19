import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import { brandColors } from './theme';
import { HomePage } from './pages/HomePage';
import { ActivateInvitationPage } from './pages/ActivateInvitationPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MonitorPage } from './pages/MonitorPage';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar superior */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {/* Logo simple usando el rojo de marca */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: brandColors.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: 'white', fontWeight: 700, fontSize: 14 }}
            >
              GF
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              textDecoration: 'none',
              color: 'text.primary',
            }}
          >
            GuardianFlux
          </Typography>

          {/* Enlaces rápidos en el header */}
          <Button
            color="inherit"
            component={RouterLink}
            to="/dashboard"
            sx={{ mr: 1 }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/monitor"
            sx={{ mr: 1 }}
          >
            Monitor
          </Button>
          <Button variant="outlined" color="primary" size="small">
            Iniciar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido principal enrutado */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            borderTop: (theme) => `4px solid ${theme.palette.secondary.main}`,
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/activate" element={<ActivateInvitationPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/monitor" element={<MonitorPage />} />
          </Routes>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
