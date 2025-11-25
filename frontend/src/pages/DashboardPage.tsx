// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../auth/token';

type AccountProps = {
  id: string;
  userId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  createdAt: string;
};

type Account = {
  props: AccountProps;
};

type AccountsResponse = {
  accounts: Account[];
};

export function DashboardPage() {
  const [accounts, setAccounts] = useState<AccountProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          throw new Error('No hay sesión activa.');
        }

        const response = await fetch(`${API_BASE_URL}/accounts/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let message = 'Error al cargar las cuentas';
          try {
            const body = await response.json();
            if (body?.message) {
              message = Array.isArray(body.message)
                ? body.message.join(', ')
                : body.message;
            }
          } catch {
            /* ignorar error de parseo */
          }
          throw new Error(message);
        }

        const json: AccountsResponse = await response.json();
        const mappedAccounts = (json.accounts || []).map((acc) => acc.props);
        setAccounts(mappedAccounts);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error inesperado';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
        Dashboard de cliente
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
        Aquí verás tus cuentas, saldos y datos principales.
      </Typography>

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
          {accounts.map((account) => (
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
