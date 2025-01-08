import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Recupera i messaggi dalla memoria (backend)
        const fetchMessages = async () => {
            const response = await axios.get('http://localhost:3001/api/chat');
            setMessages(response.data.messages);
        };
        fetchMessages();
    }, []);

    const handleSendMessage = async () => {
        const senderEmail = 'sender@example.com'; // Cambia con l'utente loggato
        const receiverEmail = 'receiver@example.com'; // Cambia con l'altro utente

        await axios.post('http://localhost:3001/api/chat', { senderEmail, receiverEmail, message });
        setMessages([...messages, { senderEmail, receiverEmail, message }]);
        setMessage('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        {msg.senderEmail}: {msg.message}
                    </div>
                ))}
            </div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSendMessage}>Invia</button>
        </div>
    );
};

export default Chat;
