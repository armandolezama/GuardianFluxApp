// src/pages/WithdrawForm.tsx
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Alert,
  Typography,
} from '@mui/material';
import { API_BASE_URL } from '../config/api';
import { getAccessToken } from '../auth/token';
import { useAccounts } from '../hooks/useAccounts';
import { AccountSelect } from '../components/AccountSelect';

type WithdrawValues = {
  accountId: string;
  amount: string; // como string por el TextField
  description: string;
};

type WithdrawErrors = Partial<Record<keyof WithdrawValues, string>>;

const initialValues: WithdrawValues = {
  accountId: '',
  amount: '',
  description: '',
};

export function WithdrawForm() {
  const [values, setValues] = useState<WithdrawValues>(initialValues);
  const [errors, setErrors] = useState<WithdrawErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const { accounts, loading: accountsLoading, refresh } = useAccounts();

  // Preseleccionar primera cuenta disponible
  useEffect(() => {
    if (!accountsLoading && accounts.length > 0 && !values.accountId) {
      setValues((prev) => ({ ...prev, accountId: accounts[0].id }));
    }
  }, [accountsLoading, accounts, values.accountId]);

  const validate = (vals: WithdrawValues): WithdrawErrors => {
    const newErrors: WithdrawErrors = {};

    if (!vals.accountId) {
      newErrors.accountId = 'Selecciona una cuenta';
    }

    const amountNumber = Number(vals.amount);
    if (!vals.amount.trim()) {
      newErrors.amount = 'El monto es obligatorio';
    } else if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      newErrors.amount = 'Ingresa un monto válido mayor a 0';
    }

    if (!vals.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleAccountChange = (accountId: string) => {
    setValues((prev) => ({
      ...prev,
      accountId,
    }));
    setErrors((prev) => ({
      ...prev,
      accountId: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(null);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No hay sesión activa.');
      }

      const body = {
        accountId: values.accountId,
        amount: Number(values.amount),
        description: values.description.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/movements/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let message = 'Error al realizar el retiro';
        try {
          const data = await response.json();
          if (data?.message) {
            message = Array.isArray(data.message)
              ? data.message.join(', ')
              : data.message;
          }
        } catch {
          /* ignore parse error */
        }
        throw new Error(message);
      }

      // Podrías leer la respuesta, pero con refresh es suficiente
      // const data = await response.json();
      await refresh();

      setApiSuccess('Retiro realizado correctamente.');
      setValues((prev) => ({
        ...prev,
        amount: '',
        description: '',
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado en el retiro';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Retiro
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      {apiSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {apiSuccess}
        </Alert>
      )}

      <AccountSelect
        label="Cuenta de retiro"
        value={values.accountId}
        onChange={handleAccountChange}
        error={Boolean(errors.accountId)}
        helperText={errors.accountId}
      />

      <TextField
        label="Monto"
        name="amount"
        type="number"
        value={values.amount}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.amount)}
        helperText={errors.amount}
        inputProps={{ min: 0, step: '0.01' }}
      />

      <TextField
        label="Descripción"
        name="description"
        value={values.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.description)}
        helperText={errors.description}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ mt: 2 }}
        fullWidth
      >
        {isSubmitting ? 'Procesando...' : 'Confirmar retiro'}
      </Button>
    </Box>
  );
}
