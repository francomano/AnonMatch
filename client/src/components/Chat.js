import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [token, setToken] = useState(null);
    const [senderEmail, setSenderEmail] = useState(null);
    const messagesEndRef = useRef(null);

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
        loadCredentials();
    }, []);

    useEffect(() => {
        if (token && senderEmail) {
            loadMessages();
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
        <View 
            style={[
                styles.messageBubble, 
                item.sender_email === senderEmail ? styles.received : styles.sent
            ]}
        >
            <Text 
                style={[
                    styles.messageText, 
                    item.sender_email === senderEmail ? styles.receivedText : styles.messageText
                ]}
            >
                {item.message}
            </Text>
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
            <ScrollView 
                style={styles.chatWindow}
                contentContainerStyle={styles.messageContainer}
                ref={messagesEndRef}
                onContentSizeChange={() => scrollToBottom()} // Scroll to bottom when content changes
            >
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.messageContainer}
                />
            </ScrollView>

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
        backgroundColor: '#f0f8ff', // Colore di sfondo carino per la chat
        padding: 10,
    },
    chatWindow: {
        flex: 1,
        maxHeight: '80%', // Limita l'altezza della chat
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
        backgroundColor: '#E91E63', // Fucsia per i tuoi messaggi
        alignSelf: 'flex-end', // Allineamento a destra
    },
    received: {
        backgroundColor: '#D3D3D3', // Grigio chiaro per i messaggi ricevuti
        alignSelf: 'flex-start', // Allineamento a sinistra
    },
    messageText: {
        color: 'white', // Testo bianco per i messaggi inviati (fucsia)
    },
    receivedText: {
        color: 'black', // Testo nero per i messaggi ricevuti (grigio chiaro)
    },
    input: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    sendButton: {
        backgroundColor: '#E91E63', // Fucsia per il bottone invio
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
