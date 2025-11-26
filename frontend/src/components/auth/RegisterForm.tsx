import { useState } from 'react';
import { Box, Button, TextField, Typography  } from '@mui/material';


export default function RegisterForm() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [invitationCode, setInvitationCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setError('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Confirmar password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Código de invitación"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                fullWidth
                margin="normal"
            />

            {error && (
                <Typography variant="caption" color="error">
                    {error}
                </Typography>
            )}

            <Button variant="contained" type="submit">
                Registrarse
            </Button>
        </Box>
    );
}