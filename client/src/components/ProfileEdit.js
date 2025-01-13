import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileEdit = ({ setCurrentPage, onBackToProfile }) => {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        orientation: '',
        goal: '',
        music_genre: '',
        movie_genre: '',
        sport: '',
        description: '',
        profile_picture: null, // Gestione del file
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3001/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Errore nel recupero del profilo', error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: files[0], // Salva il file selezionato
        }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        
        const formData = new FormData();
        if (profileData.profile_picture) {
            formData.append('profile_picture', profileData.profile_picture);
        }

        try {
            let profilePictureUrl = null;
            if (formData.has('profile_picture')) {
                const fileResponse = await axios.put('http://localhost:3003/api/profile', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                profilePictureUrl = fileResponse.data.profile_picture; // Ottieni l'URL dell'immagine
            }

            const updatedData = {
                ...profileData,
                profile_picture: profilePictureUrl, // URL ottenuto dal server di immagini
            };

            await axios.put('http://localhost:3001/api/profile', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Profilo aggiornato:', updatedData);
        } catch (error) {
            console.error('Errore nell\'aggiornamento del profilo:', error);
        }
    };

    return (
        <div>
            <h2>Modifica Profilo</h2>
            <form>
                <div>
                    <label>Nome</label>
                    <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Orientamento</label>
                    <select
                        name="orientation"
                        value={profileData.orientation}
                        onChange={handleChange}
                    >
                        <option value="">Seleziona...</option>
                        <option value="Heterosexual">Eterosessuale</option>
                        <option value="Homosexual">Omossessuale</option>
                        <option value="Bisexual">Bisessuale</option>
                        <option value="Other">Altro</option>
                    </select>
                </div>
                <div>
                    <label>Obiettivo</label>
                    <select
                        name="goal"
                        value={profileData.goal}
                        onChange={handleChange}
                    >
                        <option value="">Seleziona...</option>
                        <option value="Dating">Incontrare qualcuno</option>
                        <option value="Friendship">Amicizia</option>
                        <option value="Networking">Lavoro/Networking</option>
                    </select>
                </div>
                <div>
                    <label>Genere di musica preferito</label>
                    <select
                        name="music_genre"
                        value={profileData.music_genre}
                        onChange={handleChange}
                    >
                        <option value="">Seleziona...</option>
                        <option value="Pop">Pop</option>
                        <option value="Rock">Rock</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="Classical">Classica</option>
                        <option value="Jazz">Jazz</option>
                    </select>
                </div>
                <div>
                    <label>Genere di film preferito</label>
                    <select
                        name="movie_genre"
                        value={profileData.movie_genre}
                        onChange={handleChange}
                    >
                        <option value="">Seleziona...</option>
                        <option value="Action">Azione</option>
                        <option value="Comedy">Commedia</option>
                        <option value="Drama">Dramma</option>
                        <option value="Sci-Fi">Fantascienza</option>
                        <option value="Horror">Horror</option>
                    </select>
                </div>
                <div>
                    <label>Sport preferito</label>
                    <select
                        name="sport"
                        value={profileData.sport}
                        onChange={handleChange}
                    >
                        <option value="">Seleziona...</option>
                        <option value="Soccer">Calcio</option>
                        <option value="Basketball">Basket</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Swimming">Nuoto</option>
                        <option value="Cycling">Ciclismo</option>
                    </select>
                </div>
                <div>
                    <label>Descrizione</label>
                    <textarea
                        name="description"
                        value={profileData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Foto Profilo</label>
                    <input
                        type="file"
                        name="profile_picture"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handleSave}
                        style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        Salva
                    </button>
                    <button 
                        type="button" 
                        onClick={onBackToProfile} 
                        style={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        Torna al profilo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEdit;
