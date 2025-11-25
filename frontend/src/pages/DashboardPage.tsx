// src/pages/DashboardPage.tsx
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '../hooks/useAccounts';
import { type AccountProps } from '../contexts/AccountsContext';

export function DashboardPage() {
  const { accounts, loading, error } = useAccounts();
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
        Dashboard de cliente
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        Aquí verás tus cuentas, saldos y accesos rápidos a tus movimientos.
      </Typography>

      {/* Acciones rápidas */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/movements/withdraw')}
        >
          Hacer retiro
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/movements/deposit')}
        >
          Hacer depósito
        </Button>
      </Box>

      {loading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && accounts.length === 0 && (
        <Typography sx={{ mt: 2 }}>
          No se encontraron cuentas asociadas a tu usuario.
        </Typography>
      )}

      {!loading && !error && accounts.length > 0 && (
        <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
          {accounts.map((account: AccountProps) => (
            <Card key={account.id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Número de cuenta
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {account.accountNumber}
                </Typography>

                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Saldo
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {account.balance.toLocaleString('es-MX', {
                    style: 'currency',
                    currency: account.currency || 'MXN',
                  })}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Moneda: {account.currency}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Creada el:{' '}
                  {new Date(account.createdAt).toLocaleString('es-MX')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
