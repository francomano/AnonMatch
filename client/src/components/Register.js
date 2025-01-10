import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/register', {
                email,
                password,
                name,
            });
            const token = response.data.token;
            localStorage.setItem('token', token); // Salva il token nel localStorage
            window.location.reload(); // Ricarica la pagina per passare alla schermata di chat
        } catch (error) {
            setError('Errore nella registrazione!');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Registrati</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Register;
