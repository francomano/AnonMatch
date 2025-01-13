import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ onEdit, onBackToChat }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Recupera i dati del profilo dal backend
                const response = await axios.get('http://localhost:3001/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data); // Verifica cosa contiene la risposta

                // Assegna i dati ricevuti al state profile
                setProfile({
                    name: response.data.name,
                    email: response.data.email,
                    profile_picture: response.data.profile_picture,
                });

                setLoading(false);
            } catch (err) {
                setError('Errore nel caricamento del profilo');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    return (
        <div>
            <h2>Profilo</h2>
            {loading ? (
                <p>Caricamento del profilo...</p>
            ) : error ? (
                <p>{error}</p>
            ) : profile ? (
                <div>
                    {/* Assegna i valori dal profile agli elementi corrispondenti */}
                    <p><strong>Nome:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>

                    {/* Mostra la foto del profilo se disponibile */}
                    {profile.profile_picture ? (
                        <img
                            src={profile.profile_picture}
                            alt="Foto profilo"
                            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                        />
                    ) : (
                        <p>Foto non disponibile</p>
                    )}

                    <button onClick={onEdit} style={{ marginTop: '20px' }}>
                        Modifica Profilo
                    </button>
                    <button onClick={onBackToChat} style={{ marginTop: '20px', marginLeft: '10px' }}>
                        Torna alla chat
                    </button>
                </div>
            ) : (
                <p>Il profilo non è disponibile.</p>
            )}
        </div>
    );
};

export default Profile;
