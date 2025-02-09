import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [token, setToken] = useState(null);
    const [senderEmail, setSenderEmail] = useState(null);
    const messagesEndRef = useRef(null); // Riferimento per scrollare verso il fondo

    // Recupera il token e l'email del mittente da AsyncStorage
    const loadCredentials = async () => {
        const savedToken = await AsyncStorage.getItem('token');
        const savedSenderEmail = await AsyncStorage.getItem('senderEmail');
        setToken(savedToken);
        setSenderEmail(savedSenderEmail);
    };

    // Carica i messaggi all'avvio
    const loadMessages = async () => {
        if (!senderEmail) {
            console.error('Destinatario non specificato.');
            setError('Destinatario non specificato.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get('http://192.168.0.24:3001/api/chat', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: {
                    receiverEmail: senderEmail,
                },
            });

            setMessages(response.data.messages);
        } catch (error) {
            console.error('Errore nel recupero dei messaggi:', error);
            setError('Errore nel recupero dei messaggi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCredentials(); // Carica il token e l'email all'avvio
    }, []);

    useEffect(() => {
        if (token && senderEmail) {
            loadMessages(); // Carica i messaggi quando il token e l'email sono disponibili
        }
    }, [token, senderEmail]);

    const handleSendMessage = async () => {
        if (!message) {
            setError('Il messaggio non può essere vuoto');
            return;
        }

        try {
            const senderEmail = await AsyncStorage.getItem('email'); // Prendi l'email del mittente
            const receiverEmail = await AsyncStorage.getItem('senderEmail'); // Prendi l'email del destinatario

            const response = await axios.post(
                'http://192.168.0.24:3001/api/chat',
                { senderEmail, receiverEmail, message },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            setMessages((prevMessages) => [...prevMessages, { sender_email: senderEmail, message }]);
            setMessage('');
        } catch (error) {
            setError('Errore nell\'invio del messaggio');
            console.error('Errore nell\'invio del messaggio:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageBubble, item.sender_email === senderEmail ? styles.sent : styles.received]}>
            <Text style={styles.messageText}>{item.message}</Text>
        </View>
    );

    const scrollToBottom = () => {
        messagesEndRef.current.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messageContainer}
                ref={messagesEndRef}
            />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Scrivi un messaggio"
                multiline
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Invia</Text>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 10,
    },
    messageContainer: {
        paddingBottom: 10,
    },
    messageBubble: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
    },
    sent: {
        backgroundColor: '#4CAF50',
        alignSelf: 'flex-end',
    },
    received: {
        backgroundColor: '#f1f1f1',
        alignSelf: 'flex-start',
    },
    messageText: {
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default Chat;
