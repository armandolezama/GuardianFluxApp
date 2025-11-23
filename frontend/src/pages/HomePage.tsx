import { Box, Button, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function HomePage() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
        GuardianFlux - Banco de demostracion para portafolio"
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Es un Banco simulado, utiliza una invitación para entrar 
        y explorar sus funcionalidades.
        Permite ver depósitos y retiros. 
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <List>
            <ListItem>
              <ListItemText primary="Abrir cuenta con invitación" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Enviar y recibir depósitos" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Panel de monitoreo para observadores" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

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
