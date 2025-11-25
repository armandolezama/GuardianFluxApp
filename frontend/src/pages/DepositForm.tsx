// src/pages/DepositForm.tsx
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
import { type AccountProps } from '../contexts/AccountsContext';

type DepositValues = {
  originAccountId: string;
  destinationAccountNumber: string;
  amount: string; // string para el TextField
  description: string;
};

type DepositErrors = Partial<Record<keyof DepositValues, string>>;

const initialValues: DepositValues = {
  originAccountId: '',
  destinationAccountNumber: '',
  amount: '',
  description: '',
};

export function DepositForm() {
  const [values, setValues] = useState<DepositValues>(initialValues);
  const [errors, setErrors] = useState<DepositErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const { accounts, loading: accountsLoading, refresh } = useAccounts();

  // Preseleccionar primera cuenta disponible como origen
  useEffect(() => {
    if (!accountsLoading && accounts.length > 0 && !values.originAccountId) {
      setValues((prev) => ({ ...prev, originAccountId: accounts[0].id }));
    }
  }, [accountsLoading, accounts, values.originAccountId]);

  const validate = (vals: DepositValues): DepositErrors => {
    const newErrors: DepositErrors = {};

    if (!vals.originAccountId) {
      newErrors.originAccountId = 'Selecciona una cuenta de origen';
    }

    if (!vals.destinationAccountNumber.trim()) {
      newErrors.destinationAccountNumber =
        'Ingresa la cuenta destino';
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

  const handleOriginAccountChange = (accountId: string) => {
    setValues((prev) => ({
      ...prev,
      originAccountId: accountId,
    }));
    setErrors((prev) => ({
      ...prev,
      originAccountId: undefined,
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

      const originAccount = accounts.find(
        (acc: AccountProps) => acc.id === values.originAccountId,
      );

      if (!originAccount) {
        throw new Error('No se encontró la cuenta de origen seleccionada.');
      }

      const body = {
        originAccountNumber: originAccount.accountNumber,
        destinationAccountNumber: values.destinationAccountNumber.trim(),
        amount: Number(values.amount),
        description: values.description.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/movements/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let message = 'Error al realizar el depósito';
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

      // Ignoramos cualquier info de la cuenta destino por seguridad
      // const data = await response.json();
      await refresh();

      setApiSuccess('Depósito realizado correctamente.');
      setValues((prev) => ({
        ...prev,
        destinationAccountNumber: '',
        amount: '',
        description: '',
      }));
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error inesperado en el depósito';
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
        Depósito
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
        label="Cuenta de origen"
        value={values.originAccountId}
        onChange={handleOriginAccountChange}
        error={Boolean(errors.originAccountId)}
        helperText={errors.originAccountId}
      />

      <TextField
        label="Cuenta destino"
        name="destinationAccountNumber"
        value={values.destinationAccountNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.destinationAccountNumber)}
        helperText={errors.destinationAccountNumber}
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
        {isSubmitting ? 'Procesando...' : 'Confirmar depósito'}
      </Button>
    </Box>
  );
}
