import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
} from 'react-native';
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

    const scrollToBottom = () => {
        messagesEndRef.current.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* Usa ScrollView per gestire lo scorrimento dei messaggi */}
                    <ScrollView
                        ref={messagesEndRef}
                        contentContainerStyle={styles.messageContainer}
                    >
                        {messages.map((item, index) => (
                            <View 
                                key={index}
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
                        ))}
                    </ScrollView>

                    {loading && <ActivityIndicator size="large" color="#0000ff" />}

                    <View style={styles.inputContainer}>
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
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
        padding: 10,
        width: '100%',
    },
    messageContainer: {
        flexGrow: 1,
        paddingBottom: 10,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
        marginVertical: 5,
        alignSelf: 'flex-start',
    },
    sent: {
        backgroundColor: '#E91E63',
        alignSelf: 'flex-end',
    },
    received: {
        backgroundColor: '#D3D3D3',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        padding: 12,
        backgroundColor: '#fff',
    },
    sendButton: {
        backgroundColor: '#E91E63',
        padding: 12,
        borderRadius: 20,
        marginLeft: 10,
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
