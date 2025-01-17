import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    // Recupera il token dal localStorage
    const token = localStorage.getItem('token');
    
    // Funzione per caricare i messaggi dal backend
    const loadMessages = async () => {
        const receiverEmail = localStorage.getItem('senderEmail'); // Recupera l'email del destinatario dal localStorage
        if (!receiverEmail) {
            console.error('Nessuna email del destinatario trovata nel localStorage.');
            setError('Destinatario non specificato.');
            return;
        }
    
        try {
            const response = await axios.get('http://localhost:3001/api/chat', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    receiverEmail: receiverEmail, // Passa l'email del destinatario come parametro
                },
            });
    
            setMessages(response.data.messages); // Popola lo stato dei messaggi
        } catch (error) {
            console.error('Errore nel recupero dei messaggi:', error);
            setError('Errore nel recupero dei messaggi');
        }
    };    

    // Carica i messaggi quando il componente viene montato
    useEffect(() => {
        loadMessages();
    }, [token]); // Ricarica i messaggi ogni volta che il token cambia

    // Gestore per inviare il messaggio
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message) {
            setError('Il messaggio non può essere vuoto');
            return;
        }

        try {
            // Prendi l'email del destinatario dal localStorage
            const senderEmail = localStorage.getItem('email'); // L'email dell'utente loggato
            const receiverEmail = localStorage.getItem('senderEmail'); // L'email del destinatario (casuale)
            
            // Effettua la richiesta POST per inviare il messaggio
            const response = await axios.post(
                'http://localhost:3001/api/chat', 
                { senderEmail, receiverEmail, message },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`  // Includi il token nel header
                    }
                }
            );

            // Aggiungi il nuovo messaggio alla lista
            setMessages([...messages, { sender_email: senderEmail, message }]);
            setMessage(''); // Pulisci il campo del messaggio

        } catch (error) {
            setError('Errore nell\'invio del messaggio');
            console.error('Errore nell\'invio del messaggio:', error);
        }
    };

    return (
        <div>
            <div className="message-container">
                {messages.map((msg, index) => (
                    <div 
                        key={index}
                        className={`message-bubble ${msg.sender_email === localStorage.getItem('email') ? 'sent' : 'received'}`}
                    >
                        {msg.message}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage}>
                <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Scrivi un messaggio" 
                    required
                />
                <button type="submit">Invia</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
};

export default Chat;
