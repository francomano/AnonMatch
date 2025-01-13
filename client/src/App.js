import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import Profile from './components/Profile';  // Componente per visualizzare il profilo
import ProfileEdit from './components/ProfileEdit';  // Componente per modificare il profilo
import './App.css';
import axios from 'axios';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [authStep, setAuthStep] = useState('choose');  // 'choose', 'login', 'register'
    const [currentPage, setCurrentPage] = useState('chat');  // Gestisce la pagina attuale
    const [profile, setProfile] = useState(null);  // Stato per il profilo

    // Funzione per gestire il login
    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
        setAuthStep('choose');
    };

    // Funzione per gestire il logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthStep('choose');
        setCurrentPage('chat');
    };

    // Funzione per passare alla schermata di login
    const handleLoginStep = () => {
        setAuthStep('login');
    };

    // Funzione per passare alla schermata di registrazione
    const handleRegisterStep = () => {
        setAuthStep('register');
    };

    // Funzione per passare alla schermata di modifica del profilo
    const handleProfileEdit = () => {
        setCurrentPage('profile-edit');
    };

    // Funzione per caricare il profilo
    const fetchProfile = async () => {
        if (token) {
            try {
                const response = await axios.get('http://localhost:3001/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Errore nel recupero del profilo', error);
            }
        }
    };

    // Carica il profilo quando l'utente è loggato
    useEffect(() => {
        if (token && currentPage === 'profile') {
            fetchProfile();
        }
    }, [token, currentPage]);

    // Funzione per tornare alla chat
    const handleBackToChat = () => {
        setCurrentPage('chat');
    };

    // Funzione per tornare al profilo
    const handleBackToProfile = () => {
        setCurrentPage('profile');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>AnonMatch</h1>

            {/* Se l'utente è loggato */}
            {token ? (
                <div>
                    {/* Se siamo nella pagina della chat */}
                    {currentPage === 'chat' && (
                        <div>
                            <Chat />
                            <button 
                                onClick={handleLogout} 
                                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                Logout
                            </button>
                            <button
                                onClick={() => setCurrentPage('profile')}
                                style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                Visualizza Profilo
                            </button>
                        </div>
                    )}

                    {/* Se siamo nella pagina del profilo */}
                    {currentPage === 'profile' && (
                        <div>
                            <Profile profile={profile} onEdit={handleProfileEdit} onBackToChat={handleBackToChat} />
                        </div>
                    )}

                    {/* Se siamo nella pagina di modifica del profilo */}
                    {currentPage === 'profile-edit' && (
                        <div>
                            <ProfileEdit onSave={handleBackToProfile} onBackToProfile={handleBackToProfile} />
                            
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    {/* Se l'utente deve scegliere tra login o registrazione */}
                    {authStep === 'choose' && (
                        <div>
                            <p>Benvenuto! Scegli cosa fare:</p>
                            <button 
                                onClick={handleRegisterStep} 
                                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                Registrati
                            </button>
                            <button 
                                onClick={handleLoginStep} 
                                style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                Login
                            </button>
                        </div>
                    )}

                    {/* Se si è scelto di registrarsi */}
                    {authStep === 'register' && (
                        <div>
                            <h2>Registrazione</h2>
                            <Register onRegistered={() => setAuthStep('login')} />
                            <button 
                                onClick={handleLoginStep} 
                                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                Hai già un account? Accedi
                            </button>
                        </div>
                    )}

                    {/* Se si è scelto di fare login */}
                    {authStep === 'login' && (
                        <div>
                            <h2>Login</h2>
                            <Login onLogin={handleLogin} />
                            <button 
                                onClick={handleRegisterStep} 
                                style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
                            >
                                Non hai un account? Registrati
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;
