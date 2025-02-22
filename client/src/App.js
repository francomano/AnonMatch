import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfileEdit';
import axios from 'axios';

const App = () => {
    const [token, setToken] = useState(null);
    const [authStep, setAuthStep] = useState('choose'); // 'choose', 'login', 'register'
    const [currentPage, setCurrentPage] = useState('chat');
    const [profile, setProfile] = useState(null);

    // Carica il token salvato
    useEffect(() => {
        const loadToken = async () => {
            const savedToken = await AsyncStorage.getItem('token');
            if (savedToken) {
                setToken(savedToken);
            }
        };
        loadToken();
    }, []);

    // Salva il token quando l'utente fa il login
    const handleLogin = async (token) => {
        await AsyncStorage.setItem('token', token);
        setToken(token);
        setAuthStep('choose');
    };

    // Logout
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
        setAuthStep('choose');
        setCurrentPage('chat');
    };

    // Carica il profilo se siamo nella schermata profilo
    useEffect(() => {
        const fetchProfile = async () => {
            if (token && currentPage === 'profile') {
                try {
                    const response = await axios.get('http://localhost:3001/api/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setProfile(response.data);
                } catch (error) {
                    console.error('Errore nel recupero del profilo', error);
                }
            }
        };
        fetchProfile();
    }, [token, currentPage]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>AnonMatch</Text>

            {token ? (
                <View style={styles.pageContainer}>
                    {currentPage === 'chat' && (
                        <View style={styles.pageContent}>
                            <Chat />
                            <Button title="Logout" color="#FF6347" onPress={handleLogout} />
                            <Button title="Visualizza Profilo" color="#4CAF50" onPress={() => setCurrentPage('profile')} />
                        </View>
                    )}

                    {currentPage === 'profile' && (
                        <Profile profile={profile} onEdit={() => setCurrentPage('profile-edit')} onBackToChat={() => setCurrentPage('chat')} />
                    )}

                    {currentPage === 'profile-edit' && (
                        <ProfileEdit onSave={() => setCurrentPage('profile')} onBackToProfile={() => setCurrentPage('profile')} />
                    )}
                </View>
            ) : (
                <View style={styles.pageContainer}>
                    {authStep === 'choose' && (
                        <View style={styles.authContainer}>
                            <Text>Benvenuto! Scegli cosa fare:</Text>
                            <Button title="Registrati" color="#E91E63" onPress={() => setAuthStep('register')} />
                            <Button title="Login" color="#2196F3" onPress={() => setAuthStep('login')} />
                        </View>
                    )}

                    {authStep === 'register' && (
                        <View style={styles.authContainer}>
                            <Text style={styles.subtitle}>Registrazione</Text>
                            <Register onRegistered={() => setAuthStep('login')} />
                            <Button title="Hai già un account? Accedi" color="#FF6347" onPress={() => setAuthStep('login')} />
                        </View>
                    )}

                    {authStep === 'login' && (
                        <View style={styles.authContainer}>
                            <Text style={styles.subtitle}>Login</Text>
                            <Login onLogin={handleLogin} />
                            <Button title="Non hai un account? Registrati" color="#4CAF50" onPress={() => setAuthStep('register')} />
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

// 🎨 Stili per React Native (sostituisce CSS)
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'stretch',  // Assicura che i contenuti si espandano orizzontalmente
        justifyContent: 'flex-start', // Inizia la disposizione dei componenti dal top
        padding: 20,
        width: '100%', // Usa tutta la larghezza disponibile
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pageContainer: {
        width: '100%',
        flexDirection: 'column',
    },
    pageContent: {
        flex: 1,
        justifyContent: 'space-between', // Spazia correttamente gli elementi
    },
    authContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between', // Spazia i componenti di login e registrazione
        marginBottom: 20,
        width: '100%',
    },
});

export default App;
