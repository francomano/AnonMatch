import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            // Effettua la chiamata per autenticarsi
            const response = await axios.post('http://192.168.0.24:3001/api/login', { email, password });

            // Salva il token e altre informazioni in AsyncStorage
            await AsyncStorage.setItem('token', response.data.token);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('senderEmail', response.data.senderEmail);

            // Chiamata al callback per aggiornare lo stato dell'app
            onLogin(response.data.token);

        } catch (error) {
            setError('Credenziali non valide');
            console.error("Errore nella login:", error);
            Alert.alert("Errore", "Credenziali non valide"); // Messaggio di errore per l'utente
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

// 🎨 Stili per React Native
const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default Login;
