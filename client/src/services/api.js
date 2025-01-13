import axios from 'axios';

// Impostazioni di base per le chiamate API
const api = axios.create({
    baseURL: 'http://localhost:3001/api',  // Punti al server locale
    headers: {
        'Content-Type': 'application/json',
    },
});

// Funzione per registrare un nuovo utente
export const registerUser = async (userData) => {
    return api.post('/register', userData);
};

// Funzione per ottenere i messaggi della chat
export const getMessages = async () => {
    return api.get('/chat');
};

// Funzione per inviare un messaggio
export const sendMessage = async (messageData) => {
    return api.post('/chat', messageData);
};

// Funzione per ottenere il profilo dell'utente
export const getProfile = async () => {
    return api.get('/profile', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
};

// Funzione per aggiornare il profilo dell'utente
export const updateProfile = async (formData) => {
    return api.post('/profile/edit', formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data', // Indica che stai inviando un form-data
        },
    });
};
