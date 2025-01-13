import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [orientation, setOrientation] = useState('');
    const [status, setStatus] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/register', {
                email,
                password,
                name,
                orientation,
                status,
                birthday,
                gender,
                nationality,
                city
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
            >
                <option value="">Seleziona il tuo status</option>
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

            {/* Select per Nazionalità */}
            <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                required
            >
                <option value="">Seleziona la tua nazionalità</option>
                <option value="italian">Italiana</option>
                <option value="american">Americana</option>
                <option value="british">Britannica</option>
                <option value="french">Francese</option>
                <option value="german">Tedesca</option>
                <option value="spanish">Spagnola</option>
                <option value="other">Altro</option>
            </select>

            {/* Select per Città */}
            <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
            >
                <option value="">Seleziona la tua città</option>
                <option value="rome">Roma</option>
                <option value="milan">Milano</option>
                <option value="naples">Napoli</option>
                <option value="turin">Torino</option>
                <option value="palermo">Palermo</option>
                <option value="genoa">Genova</option>
                <option value="bologna">Bologna</option>
                <option value="florence">Firenze</option>
                <option value="venice">Venezia</option>
                <option value="verona">Verona</option>
                <option value="catania">Catania</option>
                <option value="bari">Bari</option>
            </select>

            <button type="submit">Registrati</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Register;
