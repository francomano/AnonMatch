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
        // Recupera lo status e la città dell'utente loggato
        const userQuery = `
            SELECT user_status, city
            FROM users
            WHERE email = $1;
        `;
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            console.log('Utente loggato non trovato.');
            return null;
        }

        const { user_status, city } = userResult.rows[0];
        console.log('Status e città dell\'utente loggato:', user_status, city);

        // Cerca un utente casuale con lo stesso status e città
        const matchQuery = `
            SELECT email 
            FROM users 
            WHERE email != $1 
              AND (user_status = $2 OR $2 IS NULL) -- Lo stesso status
              AND (city = $3 OR $3 IS NULL)   -- La stessa città
            ORDER BY RANDOM() 
            LIMIT 1;
        `;
        const matchResult = await pool.query(matchQuery, [email, user_status, city]);
	console.log("match: ",matchResult);

        if (matchResult.rows.length > 0) {
            console.log('Destinatario trovato:', matchResult.rows[0].email);
            return matchResult.rows[0].email;
        } else {
            console.log('Nessun destinatario trovato con gli stessi criteri.');
            return null;
        }
    } catch (error) {
        console.error('Errore durante la selezione del mittente casuale:', error);
        throw error;
    }
};



// API per la registrazione dell'utente
app.post('/api/register', async (req, res) => {
    const { email, password, name, orientation, status, birthday, gender, city} = req.body;

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
            'INSERT INTO users (email, password, name, orientation, user_status, birthday, gender, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [email, hashedPassword, name, orientation, status, birthday, gender, city]
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
    const { receiverEmail } = req.query;  // Email della persona specifica

    if (!receiverEmail) {
        return res.status(400).json({ message: 'Email del destinatario mancante.' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM messages WHERE (sender_email = $1 AND receiver_email = $2) OR (sender_email = $2 AND receiver_email = $1)',
            [senderEmail, receiverEmail]
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
    const { name, orientation, goal, music_genre, movie_genre, sport, description, profile_picture, status, nationality, city } = req.body;

    console.log("Dati ricevuti:", req.body);

    try {
        // Aggiorna il profilo dell'utente nel database
        await pool.query(`
            UPDATE users
            SET 
                name = $1, 
                profile_picture = $2,
                user_status = $3,
                nationality = $4,
                city = $5,
                orientation = $6,
                situation = $7,
                music_genre = $8,
                movie_genre = $9,
                favorite_sport = $10,
                description = $11
            WHERE email = $12
        `, [
            name, 
            profile_picture, 
            status, 
            nationality, 
            city, 
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
            email,
            profile_picture: profile_picture
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
