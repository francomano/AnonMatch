import axios from 'axios';

// Impostazioni di base per le chiamate API
const api = axios.create({
    baseURL: 'http://localhost:3001/api',  // Punti al server locale
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (userData) => {
    return api.post('/register', userData);
};

export const getMessages = async () => {
    return api.get('/chat');
};

export const sendMessage = async (messageData) => {
    return api.post('/chat', messageData);
};
