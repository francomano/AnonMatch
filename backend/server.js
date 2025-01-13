const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 3001;

// Configura la connessione al database PostgreSQL
const pool = new Pool({
    user: 'postgres',         // Sostituisci con il tuo username del database
    host: 'localhost',             // Usa 'localhost' se PostgreSQL è in locale
    database: 'anonmatch',         // Nome del database che hai creato
    password: 'm1ll10n3r3',     // La password del tuo database
    port: 5432,                    // Porta predefinita di PostgreSQL
});

// Verifica la connessione al database
pool.on('connect', () => {
    console.log('Connesso al database');
});

pool.on('error', (err) => {
    console.error('Errore nel database', err);
});

app.use(cors());
app.use(express.json());

// Funzione per autenticare l'utente tramite JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Accesso negato, token mancante' });
    }

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token non valido' });
        }
        req.user = user;
        next();
    });
};

// Funzione per selezionare un mittente casuale dal database (diverso dall'utente loggato)
const getRandomSender = async (email) => {
    try {
        // Seleziona un utente casuale che non sia l'utente loggato
        const result = await pool.query(
            'SELECT email FROM users WHERE email != $1 ORDER BY RANDOM() LIMIT 1',
            [email]
        );
        
        // Aggiungi il log per stampare il destinatario trovato
        if (result.rows.length > 0) {
            console.log('Destinatario trovato:', result.rows[0].email);  // Stampa l'email del destinatario trovato
            return result.rows[0].email;  // Restituisce l'email del mittente casuale
        } else {
            console.log('Nessun destinatario trovato');  // Se non ci sono altri utenti
            return null;
        }
    } catch (error) {
        console.error('Errore durante la selezione del mittente casuale:', error);
        throw error;
    }
};


// API per la registrazione dell'utente
app.post('/api/register', async (req, res) => {
    const { email, password, name, orientation, situation, birthday, gender } = req.body;

    try {
        // Verifica se l'utente esiste già
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email già registrata' });
        }

        // Criptare la password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Inserire l'utente nel database
        await pool.query(
            'INSERT INTO users (email, password, name, orientation, situation, birthday, gender) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [email, hashedPassword, name, orientation, situation, birthday, gender]
        );

        // Creare il token JWT
        const token = jwt.sign({ email }, 'secretkey', { expiresIn: '1h' });

        return res.status(201).json({ token });
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        return res.status(500).json({ message: 'Errore interno del server' });
    }
});

// API per il login dell'utente
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Email o password errati' });
        }

        // Confronta la password inserita con quella criptata nel DB
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email o password errati' });
        }

        // Ottieni il mittente casuale per il login
        const senderEmail = await getRandomSender(email);
        if (!senderEmail) {
            return res.status(400).json({ message: 'Non ci sono altri utenti nel sistema' });
        }

        // Crea un token JWT con l'email dell'utente
        const token = jwt.sign({ email, senderEmail }, 'secretkey', { expiresIn: '1h' });

        return res.status(200).json({ token, email, senderEmail });
    } catch (error) {
        console.error('Errore durante il login:', error);
        return res.status(500).json({ message: 'Errore interno del server' });
    }
});

// API per inviare messaggi
app.post('/api/chat', authenticateToken, async (req, res) => {
    const { senderEmail, receiverEmail, message } = req.body;
    

    try {
        // Verifica che il destinatario esista nel database
        const receiver = await pool.query('SELECT * FROM users WHERE email = $1', [receiverEmail]);

        if (receiver.rows.length === 0) {
            return res.status(400).json({ message: 'Destinatario non trovato' });
        }

        // Inserire il messaggio nel database
        await pool.query(
            'INSERT INTO messages (sender_email, receiver_email, message) VALUES ($1, $2, $3)',
            [senderEmail, receiverEmail, message]
        );

        console.log('Messaggio inviato con successo');
        return res.status(200).json({ message: 'Messaggio inviato' });
    } catch (error) {
        console.error('Errore nell\'invio del messaggio:', error);
        return res.status(500).json({ message: 'Errore interno del server' });
    }
});

// API per ottenere i messaggi dell'utente loggato
app.get('/api/chat', authenticateToken, async (req, res) => {
    const senderEmail = req.user.email;  // L'email dell'utente loggato

    try {
        // Recuperare i messaggi inviati e ricevuti dall'utente loggato
        const result = await pool.query(
            'SELECT * FROM messages WHERE sender_email = $1 OR receiver_email = $1',
            [senderEmail]
        );
        return res.status(200).json({ messages: result.rows });
    } catch (error) {
        console.error('Errore nel recupero dei messaggi:', error);
        return res.status(500).json({ message: 'Errore interno del server' });
    }
});
// ----------------GESTIONE DEL PROFILO DELL'UTENTE-------------------
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { profile } = require('console');

// Route per ottenere il profilo (name ed email)
app.get('/api/profile', authenticateToken, async (req, res) => {
    const email = req.user.email; // Ottieni l'email dall'utente autenticato

    try {
        // Recupera il profilo dell'utente dal database
        const result = await pool.query(`
            SELECT name, email, profile_picture
            FROM users
            WHERE email = $1
        `, [email]);

        if (result.rows.length > 0) {
            const { name, email, profile_picture } = result.rows[0];
            res.status(200).json({ name, email, profile_picture });
        } else {
            res.status(404).json({ message: 'Profilo non trovato' });
        }
    } catch (error) {
        console.error('Errore nel recupero del profilo:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
});


// Route per caricare e aggiornare il profilo
app.put('/api/profile', authenticateToken, async (req, res) => {
    const email = req.user.email;
    const { name, orientation, goal, music_genre, movie_genre, sport, description} = req.body;
    profilePicture = req.body.profile_picture;
    console.log("oggetto: ", profilePicture);
    try {
        // Aggiorna il profilo dell'utente nel database
        await pool.query(`
            UPDATE users
            SET 
                name = $1, 
                profile_picture = $2,
                orientation = $3,
                situation = $4,
                music_genre = $5,
                movie_genre = $6,
                favorite_sport = $7,
                description = $8
            WHERE email = $9
        `, [
            name, 
            profilePicture, 
            orientation, 
            goal, 
            music_genre, 
            movie_genre, 
            sport, 
            description, 
            email
        ]);

        res.status(200).json({
            message: 'Profilo aggiornato con successo',
            name,
            email
        });
    } catch (error) {
        console.error('Errore nell\'aggiornamento del profilo:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
});

// Avvia il server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
