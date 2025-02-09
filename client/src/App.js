import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <Text style={styles.title}>AnonMatch</Text>

            {token ? (
                <View>
                    {currentPage === 'chat' && (
                        <View>
                            <Chat />
                            <Button title="Logout" color="#FF6347" onPress={handleLogout} />
                            <Button title="Visualizza Profilo" color="#4CAF50" onPress={() => setCurrentPage('profile')} />
                        </View>
                    )}

                    {currentPage === 'profile' && <Profile profile={profile} onEdit={() => setCurrentPage('profile-edit')} onBackToChat={() => setCurrentPage('chat')} />}

                    {currentPage === 'profile-edit' && <ProfileEdit onSave={() => setCurrentPage('profile')} onBackToProfile={() => setCurrentPage('profile')} />}
                </View>
            ) : (
                <View>
                    {authStep === 'choose' && (
                        <View>
                            <Text>Benvenuto! Scegli cosa fare:</Text>
                            <Button title="Registrati" color="#4CAF50" onPress={() => setAuthStep('register')} />
                            <Button title="Login" color="#2196F3" onPress={() => setAuthStep('login')} />
                        </View>
                    )}

                    {authStep === 'register' && (
                        <View>
                            <Text style={styles.subtitle}>Registrazione</Text>
                            <Register onRegistered={() => setAuthStep('login')} />
                            <Button title="Hai già un account? Accedi" color="#FF6347" onPress={() => setAuthStep('login')} />
                        </View>
                    )}

                    {authStep === 'login' && (
                        <View>
                            <Text style={styles.subtitle}>Login</Text>
                            <Login onLogin={handleLogin} />
                            <Button title="Non hai un account? Registrati" color="#4CAF50" onPress={() => setAuthStep('register')} />
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

// 🎨 Stili per React Native (sostituisce CSS)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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
});

export default App;
