import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    // Recupera il token dal localStorage
    const token = localStorage.getItem('token');
    
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

            // Messaggio inviato con successo
            console.log(response.data.message);
            setMessage(''); // Pulisci il campo del messaggio

        } catch (error) {
            setError('Errore nell\'invio del messaggio');
            console.error('Errore nell\'invio del messaggio:', error);
        }
    };

    return (
        <div>
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
