// frontend/src/App.tsx
import { AppBar, Box, Container, Toolbar, Typography, Paper, Button } from '@mui/material';
import { brandColors } from './theme';

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

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            GuardianFlux
          </Typography>

          {/* Aquí luego irá el switch de tema y el usuario */}
          <Button variant="outlined" color="primary" size="small">
            Iniciar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido principal */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            borderTop: theme => `4px solid ${theme.palette.secondary.main}`,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
            Bienvenido a GuardianFlux
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Aquí pronto podrás activar tu invitación, crear tu cuenta y simular movimientos
            bancarios para tu portafolio.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary">
              Activar invitación
            </Button>
            <Button variant="outlined" color="secondary">
              Ver demo de dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
