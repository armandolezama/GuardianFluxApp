import { Box, Typography } from '@mui/material';

export function DashboardPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
        Dashboard de cliente
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Aquí verás tu saldo, tu número de cuenta y formularios para depósitos y retiros.
      </Typography>
    </Box>
  );
}
