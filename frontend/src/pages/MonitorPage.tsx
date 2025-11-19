import { Box, Typography } from '@mui/material';

export function MonitorPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
        Panel de monitoreo
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Pantalla reservada para monitores: aquí listaremos movimientos, filtros y alertas.
      </Typography>
    </Box>
  );
}
