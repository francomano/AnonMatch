import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ onEdit, onBackToChat }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Ottieni il token da AsyncStorage

                if (!token) {
                    throw new Error("Token non trovato");
                }

                const response = await axios.get('http://192.168.0.24:3001/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

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
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profilo</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : profile ? (
                <View style={styles.profileContainer}>
                    <Text style={styles.profileText}><Text style={styles.boldText}>Nome:</Text> {profile.name}</Text>
                    <Text style={styles.profileText}><Text style={styles.boldText}>Email:</Text> {profile.email}</Text>

                    {profile.profile_picture ? (
                        <Image
                            source={{ uri: profile.profile_picture }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <Text>Foto non disponibile</Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <Button title="Modifica Profilo" onPress={onEdit} />
                        <Button title="Torna alla chat" onPress={onBackToChat} />
                    </View>
                </View>
            ) : (
                <Text>Il profilo non è disponibile.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileText: {
        fontSize: 18,
        marginBottom: 10,
    },
    boldText: {
        fontWeight: 'bold',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Profile;
