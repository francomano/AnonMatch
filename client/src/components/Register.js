import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Invio dei dati al server
            const response = await axios.post('http://localhost:3001/api/register', {
                email,
                password,
                name,
            });

            // Salva il token di autenticazione nel localStorage
            localStorage.setItem('token', response.data.token);
            console.log("Registrazione riuscita, token salvato:", response.data.token);
        } catch (error) {
            // Log dell'errore per capire cosa sta succedendo
            console.error("Errore nella registrazione:", error.response || error.message);

            // Imposta un messaggio di errore visibile per l'utente
            setError('Errore nella registrazione');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Registrati</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Register;
