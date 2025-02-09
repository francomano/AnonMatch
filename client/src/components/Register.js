import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Register = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [orientation, setOrientation] = useState('');
    const [status, setStatus] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://192.168.0.24:3001/api/register', {
                email,
                password,
                name,
                orientation,
                status,
                birthday,
                gender,
                nationality,
                city
            });

            const token = response.data.token;
            await AsyncStorage.setItem('token', token); // Salva il token

            Alert.alert("Registrazione riuscita", "Ora puoi accedere!");
            onRegister(); // Callback per aggiornare lo stato dell'app

        } catch (error) {
            setError('Errore nella registrazione!');
            console.error("Errore nella registrazione:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrazione</Text>

            <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

            <Text style={styles.label}>Stato Relazionale</Text>
            <Picker selectedValue={status} onValueChange={(value) => setStatus(value)} style={styles.picker}>
                <Picker.Item label="Seleziona il tuo status" value="" />
                <Picker.Item label="Single" value="single" />
                <Picker.Item label="Fidanzato" value="fidanzato" />
            </Picker>

            <Text style={styles.label}>Orientamento Sessuale</Text>
            <Picker selectedValue={orientation} onValueChange={(value) => setOrientation(value)} style={styles.picker}>
                <Picker.Item label="Seleziona il tuo orientamento" value="" />
                <Picker.Item label="Etero" value="etero" />
                <Picker.Item label="Gay" value="gay" />
                <Picker.Item label="Lesbica" value="lesbica" />
                <Picker.Item label="Bisessuale" value="bisessuale" />
                <Picker.Item label="Pansessuale" value="pansessuale" />
                <Picker.Item label="Asessuale" value="asessuale" />
                <Picker.Item label="Altro" value="altro" />
            </Picker>

            <TextInput style={styles.input} placeholder="Data di nascita (YYYY-MM-DD)" value={birthday} onChangeText={setBirthday} />

            <Text style={styles.label}>Genere</Text>
            <Picker selectedValue={gender} onValueChange={(value) => setGender(value)} style={styles.picker}>
                <Picker.Item label="Seleziona il tuo genere" value="" />
                <Picker.Item label="Maschio" value="M" />
                <Picker.Item label="Femmina" value="F" />
                <Picker.Item label="Non binario" value="non-binary" />
                <Picker.Item label="Altro" value="altro" />
            </Picker>

            <Text style={styles.label}>Nazionalità</Text>
            <Picker selectedValue={nationality} onValueChange={(value) => setNationality(value)} style={styles.picker}>
                <Picker.Item label="Seleziona la tua nazionalità" value="" />
                <Picker.Item label="Italiana" value="italian" />
                <Picker.Item label="Americana" value="american" />
                <Picker.Item label="Britannica" value="british" />
                <Picker.Item label="Francese" value="french" />
                <Picker.Item label="Tedesca" value="german" />
                <Picker.Item label="Spagnola" value="spanish" />
                <Picker.Item label="Altro" value="other" />
            </Picker>

            <Text style={styles.label}>Città</Text>
            <Picker selectedValue={city} onValueChange={(value) => setCity(value)} style={styles.picker}>
                <Picker.Item label="Seleziona la tua città" value="" />
                <Picker.Item label="Roma" value="rome" />
                <Picker.Item label="Milano" value="milan" />
                <Picker.Item label="Napoli" value="naples" />
                <Picker.Item label="Torino" value="turin" />
                <Picker.Item label="Palermo" value="palermo" />
                <Picker.Item label="Genova" value="genoa" />
                <Picker.Item label="Bologna" value="bologna" />
                <Picker.Item label="Firenze" value="florence" />
                <Picker.Item label="Venezia" value="venice" />
                <Picker.Item label="Verona" value="verona" />
                <Picker.Item label="Catania" value="catania" />
                <Picker.Item label="Bari" value="bari" />
            </Picker>

            <Button title="Registrati" onPress={handleRegister} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

// 🎨 Stili per React Native
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
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default Register;
