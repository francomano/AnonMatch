import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [orientation, setOrientation] = useState('');
    const [situation, setSituation] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/register', {
                email,
                password,
                name,
                orientation,
                situation,
                birthday,
                gender
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
            
            {/* Select per Situazione */}
            <select
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                required
            >
                <option value="">Seleziona la tua situazione</option>
                <option value="single">Single</option>
                <option value="fidanzato">Fidanzato</option>
            </select>
            
            {/* Select per Orientamento */}
            <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                required
            >
                <option value="">Seleziona il tuo orientamento sessuale</option>
                <option value="etero">Etero</option>
                <option value="gay">Gay</option>
                <option value="lesbica">Lesbica</option>
                <option value="bisessuale">Bisessuale</option>
                <option value="pansessuale">Pansessuale</option>
                <option value="asessuale">Asessuale</option>
                <option value="altro">Altro</option>
            </select>

            {/* Campo data di nascita */}
            <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder="Data di nascita"
                required
            />

            {/* Select per Sesso */}
            <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
            >
                <option value="">Seleziona il tuo genere</option>
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
                <option value="non-binary">Non binario</option>
                <option value="altro">Altro</option>
            </select>

            <button type="submit">Registrati</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Register;
