const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');  // Importa cors
const app = express();
const port = 3001;

// Usa CORS per abilitare richieste da qualsiasi origine (o specifica un'origine)
app.use(cors());  // Abilita CORS per tutte le origini

// Se vuoi limitare a un'origine specifica (ad esempio, il tuo frontend React su localhost:3000):
// app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware per parsare il corpo della richiesta
app.use(express.json());

// Importa i dati simulati per gli utenti e i messaggi
const { users, messages } = require('./usersData');

// API per la registrazione dell'utente
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;

    // Verifica se l'utente esiste già (controllo simulato in memoria)
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email già registrata' });
    }

    // Criptare la password dell'utente
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea un nuovo utente e salvalo nella "memoria"
    const newUser = { email, password: hashedPassword, name };
    users.push(newUser);

    // Crea un token di autenticazione
    const token = jwt.sign({ email: newUser.email }, 'secretkey', { expiresIn: '1h' });

    res.status(201).json({ token });
});

// API per inviare messaggi
app.post('/api/chat', (req, res) => {
    const { senderEmail, receiverEmail, message } = req.body;

    // Simula l'invio di un messaggio salvandolo nella memoria
    const newMessage = { senderEmail, receiverEmail, message };
    messages.push(newMessage);

    res.status(200).json({ message: 'Messaggio inviato' });
});

// API per ottenere i messaggi
app.get('/api/chat', (req, res) => {
    res.status(200).json({ messages });
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
