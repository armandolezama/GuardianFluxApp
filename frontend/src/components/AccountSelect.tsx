// src/components/AccountSelect.tsx
import { TextField, MenuItem } from '@mui/material';
import { type TextFieldProps } from '@mui/material';
import { useAccounts } from '../hooks/useAccounts';

type AccountSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
} & Omit<TextFieldProps, 'select' | 'onChange' | 'value' | 'label'>;

export function AccountSelect({
  value,
  onChange,
  label = 'Cuenta',
  ...textFieldProps
}: AccountSelectProps) {
  const { accounts, loading } = useAccounts();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(e.target.value);
  };

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={handleChange}
      fullWidth
      margin="normal"
      disabled={loading || accounts.length === 0}
      helperText={
        loading
          ? 'Cargando cuentas...'
          : accounts.length === 0
          ? 'No tienes cuentas disponibles'
          : textFieldProps.helperText
      }
      {...textFieldProps}
    >
      {accounts.map((account) => (
        <MenuItem key={account.id} value={account.id}>
          {account.accountNumber} ·{' '}
          {account.balance.toLocaleString('es-MX', {
            style: 'currency',
            currency: account.currency || 'MXN',
          })}
        </MenuItem>
      ))}
    </TextField>
  );
}
