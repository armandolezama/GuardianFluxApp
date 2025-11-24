import { useState } from 'react';
import { Box, Button, TextField, Typography  } from '@mui/material';


export function ActivateInvitationForm() {
  const [code, setCode] = useState('');
  const[error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("El código es obligatorio");
      return;
    }
    setError('');
  };

  return (
    <Box component="form" onSybmit={handleSubmit}>
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

        <Button
          variant="contained"
          type='submit'
          >
            Validar Invitación
        </Button>
    </Box>
    );
}

