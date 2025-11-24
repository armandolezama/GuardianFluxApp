import { Box, Typography } from '@mui/material';
import RegisterForm from '../componentes/auth/RegisterForm';

export  default function RegisterPage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
        Registro de cuenta
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Aquí mostraremos el formulario para crear tu usuario y tu cuenta usando una invitación válida.
      </Typography>
      <RegisterForm />
    </Box>
  );
}
