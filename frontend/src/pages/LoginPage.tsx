import { useState } from 'react';
import { Box, Button, TextField, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

const initialValues: LoginValues = {
  email: '',
  password: '',
};

export function LoginPage() {
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();

  const validate = (vals: LoginValues): LoginErrors => {
    const newErrors: LoginErrors = {};

    if (!vals.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!vals.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        let message = 'Credenciales inválidas o error en el inicio de sesión';
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

      const data = await response.json();

      console.log(data);
      

      // Guarda el token (ajusta según el shape de la respuesta de tu API)
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado en el login';
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
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Iniciar sesión
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <TextField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <TextField
        label="Contraseña"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.password)}
        helperText={errors.password}
      />

      <Button
        variant="contained"
        type="submit"
        disabled={isSubmitting}
        fullWidth
        sx={{ mt: 2 }}
      >
        {isSubmitting ? 'Ingresando...' : 'Entrar'}
      </Button>
    </Box>
  );
}
