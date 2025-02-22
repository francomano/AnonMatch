import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'react-native-image-picker';

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
        profile_picture: null,
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
            maxWidth: 300,
            maxHeight: 300,
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('ImagePicker Error: ', response.errorMessage);
            } else {
                setProfileData((prevData) => ({
                    ...prevData,
                    profile_picture: response.assets[0],
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
                profilePictureUrl = fileResponse.data.profile_picture;
            }

            const updatedData = {
                ...profileData,
                profile_picture: profilePictureUrl,
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
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.title}>Modifica Profilo</Text>
            <View style={styles.form}>
                <View style={styles.formSection}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.name}
                        onChangeText={(value) => handleChange('name', value)}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={profileData.email}
                        onChangeText={(value) => handleChange('email', value)}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Orientamento</Text>
                    <Picker
                        selectedValue={profileData.orientation}
                        onValueChange={(value) => handleChange('orientation', value)}
                        style={styles.picker}
                        itemStyle={{ color: '#000000' }}
                    >
                        <Picker.Item label="Seleziona..." value="" />
                        <Picker.Item label="Eterosessuale" value="Heterosexual" />
                        <Picker.Item label="Omossessuale" value="Homosexual" />
                        <Picker.Item label="Bisessuale" value="Bisexual" />
                        <Picker.Item label="Altro" value="Other" />
                    </Picker>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Obiettivo</Text>
                    <Picker
                        selectedValue={profileData.goal}
                        onValueChange={(value) => handleChange('goal', value)}
                        style={styles.picker}
                        itemStyle={{ color: '#000000' }}
                    >
                        <Picker.Item label="Seleziona..." value="" />
                        <Picker.Item label="Incontrare qualcuno" value="Dating" />
                        <Picker.Item label="Amicizia" value="Friendship" />
                        <Picker.Item label="Lavoro/Networking" value="Networking" />
                    </Picker>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Genere di musica preferito</Text>
                    <Picker
                        selectedValue={profileData.music_genre}
                        onValueChange={(value) => handleChange('music_genre', value)}
                        style={styles.picker}
                        itemStyle={{ color: '#000000' }}
                    >
                        <Picker.Item label="Seleziona..." value="" />
                        <Picker.Item label="Pop" value="Pop" />
                        <Picker.Item label="Rock" value="Rock" />
                        <Picker.Item label="Hip Hop" value="Hip Hop" />
                        <Picker.Item label="Classica" value="Classical" />
                        <Picker.Item label="Jazz" value="Jazz" />
                    </Picker>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Genere di film preferito</Text>
                    <Picker
                        selectedValue={profileData.movie_genre}
                        onValueChange={(value) => handleChange('movie_genre', value)}
                        style={styles.picker}
                        itemStyle={{ color: '#000000' }}
                    >
                        <Picker.Item label="Seleziona..." value="" />
                        <Picker.Item label="Azione" value="Action" />
                        <Picker.Item label="Commedia" value="Comedy" />
                        <Picker.Item label="Dramma" value="Drama" />
                        <Picker.Item label="Fantascienza" value="Sci-Fi" />
                        <Picker.Item label="Horror" value="Horror" />
                    </Picker>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Sport preferito</Text>
                    <Picker
                        selectedValue={profileData.sport}
                        onValueChange={(value) => handleChange('sport', value)}
                        style={styles.picker}
                        itemStyle={{ color: '#000000' }}
                    >
                        <Picker.Item label="Seleziona..." value="" />
                        <Picker.Item label="Calcio" value="Soccer" />
                        <Picker.Item label="Basket" value="Basketball" />
                        <Picker.Item label="Tennis" value="Tennis" />
                        <Picker.Item label="Nuoto" value="Swimming" />
                        <Picker.Item label="Ciclismo" value="Cycling" />
                    </Picker>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Descrizione</Text>
                    <TextInput
                        style={styles.textarea}
                        multiline
                        value={profileData.description}
                        onChangeText={(value) => handleChange('description', value)}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Foto Profilo</Text>
                    <TouchableOpacity onPress={handleFileChange} style={styles.button}>
                        <Text style={styles.buttonText}>Seleziona Immagine</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Status</Text>
                    <Picker
                        selectedValue={profileData.status}
                        onValueChange={(value) => handleChange('status', value)}
                        style={styles.picker}
                        itemStyle={{ color: '#000000' }}
                    >
                        <Picker.Item label="Seleziona" value="" />
                        <Picker.Item label="Single" value="single" />
                        <Picker.Item label="Fidanzato" value="fidanzato" />
                    </Picker>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Nazionalità</Text>
                    <Picker
                        selectedValue={profileData.nationality}
                        onValueChange={(value) => handleChange('nationality', value)}
                        style={styles.picker}
                        itemStyle={{ color: '#000000' }}
                    >
                        <Picker.Item label="Seleziona" value="" />
                        <Picker.Item label="Italiana" value="italian" />
                        <Picker.Item label="Americana" value="american" />
                        <Picker.Item label="Francese" value="french" />
                    </Picker>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Città</Text>
                    <Picker
                        selectedValue={profileData.city}
                        onValueChange={(value) => handleChange('city', value)}
                        style={styles.picker}
                        itemStyle={{ color: '#000000' }}
                    >
                        <Picker.Item label="Seleziona" value="" />
                        <Picker.Item label="Roma" value="rome" />
                        <Picker.Item label="Milano" value="milan" />
                        <Picker.Item label="Napoli" value="naples" />
                        <Picker.Item label="Firenze" value="florence" />
                        <Picker.Item label="Venezia" value="venice" />
                    </Picker>
                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.buttonText}>Salva</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onBackToProfile} style={styles.cancelButton}>
                        <Text style={styles.buttonText}>Torna al profilo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    form: {
        flex: 1,
    },
    formSection: {
        marginBottom: 18,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        padding: 12,
        fontSize: 14,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f4f4f4',
        borderColor: '#ddd',
        color: '#333',
    },
    textarea: {
        borderWidth: 1,
        padding: 12,
        fontSize: 14,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f4f4f4',
        borderColor: '#ddd',
        minHeight: 80,
        color: '#333',
    },
    picker: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 14,
        backgroundColor: '#f4f4f4',
        color: '#000000',
    },
    button: {
        backgroundColor: '#E91E63',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 14,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#E91E63',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#D3D3D3',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 20,
    },
});

export default ProfileEdit;
