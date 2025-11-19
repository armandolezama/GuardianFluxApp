import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function HomePage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
        Bienvenido a GuardianFlux
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Simula un banco real para tu portafolio: activa invitaciones, abre cuentas
        y prueba movimientos entre usuarios.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/activate"
        >
          Activar invitación
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          component={RouterLink}
          to="/dashboard"
        >
          Ir al dashboard
        </Button>
      </Box>
    </Box>
  );
}
