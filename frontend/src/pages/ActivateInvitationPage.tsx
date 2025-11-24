import { Box, Typography } from '@mui/material';
import { ActivateInvitationForm } from '../componentes/auth/ActivateInvitationForm';

export  default function ActivateInvitationPage() {
  return (
      <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
        Activar invitación
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Aquí vamos a poner el formulario para validar tu código de invitación
        contra el backend de GuardianFlux.
      </Typography>
      <ActivateInvitationForm />
    </Box>
  );
}
