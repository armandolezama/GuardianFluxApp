import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';


export function ActivateInvitationForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 

  const handleSubmit = (e: React.FormEvent) => {
    console.log(
{
code, email, password, name
}
)
    e.preventDefault();

    if (!code.trim()) {
      setError("El código es obligatorio");
      return;
    }
    setError('');
  };



  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Código de invitación"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        margin="normal"
      />

      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}

      <TextField
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal">
        Name
      </TextField>


      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal">
        Email
      </TextField>


      <TextField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal">
        Password
      </TextField>


      <Button
        variant="contained"
        type='submit'
      >
        Validar Invitación
      </Button>
    </Box>
  );
}

