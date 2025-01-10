import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [authStep, setAuthStep] = useState('choose');  // 'choose', 'login', 'register'

    // Funzione per gestire il login
    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    };

    // Funzione per gestire il logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthStep('choose');
    };

    // Funzione per passare alla schermata di login
    const handleLoginStep = () => {
        setAuthStep('login');
    };

    // Funzione per passare alla schermata di registrazione
    const handleRegisterStep = () => {
        setAuthStep('register');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>AnonMatch</h1>

            {/* Se l'utente è loggato */}
            {token ? (
                <div>
                    <Chat />
                    <button 
                        onClick={handleLogout} 
                        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        Logout
                    </button>
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
