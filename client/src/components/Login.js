import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Effettua la chiamata per autenticarsi
            const response = await axios.post('http://localhost:3001/api/login', { email, password });

            // Salva il token di autenticazione nel localStorage
            localStorage.setItem('token', response.data.token);

            // Salva l'email dell'utente loggato nel localStorage
            localStorage.setItem('email', email);

            // Salva l'email del mittente casuale nel localStorage
            localStorage.setItem('senderEmail', response.data.senderEmail); // 'senderEmail' dal backend

            // Chiamata al callback per fare il login
            onLogin(response.data.token);

        } catch (error) {
            setError('Credenziali non valide');
            console.error("Errore nella login:", error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;
