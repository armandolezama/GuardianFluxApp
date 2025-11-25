import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Alert } from '@mui/material';
import { API_BASE_URL } from '../../config/api'; // ajusta la ruta según tu estructura

type FormValues = {
  code: string;
  name: string;
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  code: '',
  name: '',
  email: '',
  password: '',
};

export function ActivateInvitationForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const validate = (vals: FormValues): FormErrors => {
    const newErrors: FormErrors = {};

    if (!vals.code.trim()) {
      newErrors.code = 'El código es obligatorio';
    }

    if (!vals.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!vals.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    if (!vals.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (vals.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
    setApiSuccess(null);

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register-with-invitation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        // Intentar leer mensaje del backend
        let message = 'Ocurrió un error al validar la invitación';
        try {
          const data = await response.json();
          if (data?.message) {
            message = Array.isArray(data.message)
              ? data.message.join(', ')
              : data.message;
          }
        } catch {
          // ignoramos error del parseo de JSON
        }
        throw new Error(message);
      }

      // Si todo salió bien
      const data = await response.json();
      console.log('Registro exitoso:', data);

      setApiSuccess('Invitación validada y usuario registrado correctamente.');
      // Opcional: limpiar formulario
      setValues(initialValues);
      // Opcional: redirigir a login/dashboard aquí
      navigate('/login');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado en el registro';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
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

      <TextField
        label="Código de invitación"
        name="code"
        value={values.code}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.code)}
        helperText={errors.code}
      />

      <TextField
        label="Nombre"
        name="name"
        value={values.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors.name)}
        helperText={errors.name}
      />

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
        label="Password"
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
        sx={{ mt: 2 }}
      >
        {isSubmitting ? 'Validando...' : 'Validar Invitación'}
      </Button>
    </Box>
  );
}
