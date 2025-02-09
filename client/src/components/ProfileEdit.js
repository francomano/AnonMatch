import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';


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
        status: '',
        nationality: '',
        city: '',
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

    const handleChange = (name, value) => {
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = () => {
        const options = {
            mediaType: 'photo',
            maxWidth: 500,
            maxHeight: 500,
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('ImagePicker Error: ', response.errorMessage);
            } else {
                setProfileData((prevData) => ({
                    ...prevData,
                    profile_picture: response.assets[0], // Salva il file selezionato
                }));
            }
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        if (profileData.profile_picture) {
            formData.append('profile_picture', {
                uri: profileData.profile_picture.uri,
                type: profileData.profile_picture.type,
                name: profileData.profile_picture.fileName,
            });
        }

        try {
            let profilePictureUrl = null;
            if (formData.has('profile_picture')) {
                const fileResponse = await axios.put('http://192.168.0.24:3003/api/profile', formData, {
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

            await axios.put('http://192.168.0.24:3001/api/profile', updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Profilo aggiornato:', updatedData);
            Alert.alert('Successo', 'Profilo aggiornato con successo');
        } catch (error) {
            console.error('Errore nell\'aggiornamento del profilo:', error);
            Alert.alert('Errore', 'Si è verificato un errore nell\'aggiornamento del profilo');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modifica Profilo</Text>
            <View style={styles.form}>
                <Text>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.name}
                    onChangeText={(value) => handleChange('name', value)}
                />

                <Text>Email</Text>
                <TextInput
                    style={styles.input}
                    value={profileData.email}
                    onChangeText={(value) => handleChange('email', value)}
                />

                <Text>Orientamento</Text>
                <Picker
                    selectedValue={profileData.orientation}
                    onValueChange={(value) => handleChange('orientation', value)}
                >
                    <Picker.Item label="Seleziona..." value="" />
                    <Picker.Item label="Eterosessuale" value="Heterosexual" />
                    <Picker.Item label="Omossessuale" value="Homosexual" />
                    <Picker.Item label="Bisessuale" value="Bisexual" />
                    <Picker.Item label="Altro" value="Other" />
                </Picker>

                <Text>Obiettivo</Text>
                <Picker
                    selectedValue={profileData.goal}
                    onValueChange={(value) => handleChange('goal', value)}
                >
                    <Picker.Item label="Seleziona..." value="" />
                    <Picker.Item label="Incontrare qualcuno" value="Dating" />
                    <Picker.Item label="Amicizia" value="Friendship" />
                    <Picker.Item label="Lavoro/Networking" value="Networking" />
                </Picker>

                <Text>Genere di musica preferito</Text>
                <Picker
                    selectedValue={profileData.music_genre}
                    onValueChange={(value) => handleChange('music_genre', value)}
                >
                    <Picker.Item label="Seleziona..." value="" />
                    <Picker.Item label="Pop" value="Pop" />
                    <Picker.Item label="Rock" value="Rock" />
                    <Picker.Item label="Hip Hop" value="Hip Hop" />
                    <Picker.Item label="Classica" value="Classical" />
                    <Picker.Item label="Jazz" value="Jazz" />
                </Picker>

                <Text>Genere di film preferito</Text>
                <Picker
                    selectedValue={profileData.movie_genre}
                    onValueChange={(value) => handleChange('movie_genre', value)}
                >
                    <Picker.Item label="Seleziona..." value="" />
                    <Picker.Item label="Azione" value="Action" />
                    <Picker.Item label="Commedia" value="Comedy" />
                    <Picker.Item label="Dramma" value="Drama" />
                    <Picker.Item label="Fantascienza" value="Sci-Fi" />
                    <Picker.Item label="Horror" value="Horror" />
                </Picker>

                <Text>Sport preferito</Text>
                <Picker
                    selectedValue={profileData.sport}
                    onValueChange={(value) => handleChange('sport', value)}
                >
                    <Picker.Item label="Seleziona..." value="" />
                    <Picker.Item label="Calcio" value="Soccer" />
                    <Picker.Item label="Basket" value="Basketball" />
                    <Picker.Item label="Tennis" value="Tennis" />
                    <Picker.Item label="Nuoto" value="Swimming" />
                    <Picker.Item label="Ciclismo" value="Cycling" />
                </Picker>

                <Text>Descrizione</Text>
                <TextInput
                    style={styles.textarea}
                    multiline
                    value={profileData.description}
                    onChangeText={(value) => handleChange('description', value)}
                />

                <Text>Foto Profilo</Text>
                <TouchableOpacity onPress={handleFileChange} style={styles.button}>
                    <Text style={styles.buttonText}>Seleziona Immagine</Text>
                </TouchableOpacity>

                <Text>Status</Text>
                <Picker
                    selectedValue={profileData.status}
                    onValueChange={(value) => handleChange('status', value)}
                >
                    <Picker.Item label="Seleziona" value="" />
                    <Picker.Item label="Single" value="single" />
                    <Picker.Item label="Fidanzato" value="fidanzato" />
                </Picker>

                <Text>Nazionalità</Text>
                <Picker
                    selectedValue={profileData.nationality}
                    onValueChange={(value) => handleChange('nationality', value)}
                >
                    <Picker.Item label="Seleziona" value="" />
                    <Picker.Item label="Italiana" value="italian" />
                    <Picker.Item label="Americana" value="american" />
                    <Picker.Item label="Francese" value="french" />
                </Picker>

                <Text>Città</Text>
                <Picker
                    selectedValue={profileData.city}
                    onValueChange={(value) => handleChange('city', value)}
                >
                    <Picker.Item label="Seleziona" value="" />
                    <Picker.Item label="Roma" value="rome" />
                    <Picker.Item label="Milano" value="milan" />
                    <Picker.Item label="Napoli" value="naples" />
                    <Picker.Item label="Firenze" value="florence" />
                    <Picker.Item label="Venezia" value="venice" />
                </Picker>

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.buttonText}>Salva</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onBackToProfile} style={styles.cancelButton}>
                        <Text style={styles.buttonText}>Torna al profilo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    textarea: {
        borderWidth: 1,
        padding: 10,
        height: 100,
        marginBottom: 15,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#FF6347',
        padding: 10,
        borderRadius: 5,
        flex: 1,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default ProfileEdit;
