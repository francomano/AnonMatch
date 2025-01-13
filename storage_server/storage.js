const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const cors = require('cors');

app.use(cors());

// Configura multer per memorizzare i file nella cartella 'uploads/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // La cartella 'uploads' dove salveremo i file
        const dir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir); // Crea la cartella se non esiste
        }
        cb(null, dir);  // Indica la cartella dove salvare i file
    },
    filename: (req, file, cb) => {
        // Usa un nome unico per ogni file, basato sul timestamp
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Inizializza multer
const upload = multer({ storage: storage });

// API per caricare una nuova immagine del profilo
app.put('/api/profile', upload.single('profile_picture'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nessun file caricato' });
    }

    const fileName = req.file.filename;  // Nome del file salvato sul server

    // Qui puoi aggiungere la logica per aggiornare il database con il nome del file
    // Ad esempio: updateUserProfile(fileName, req.user.email);
    
    const profilePictureUrl = `http://localhost:3003/uploads/${fileName}`;

    return res.status(200).json({
        message: 'Immagine caricata con successo',
        profile_picture: profilePictureUrl  // Restituisci l'URL del file caricato
    });
});

// Servire i file dalla cartella 'uploads' per accedervi tramite URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Avvia il server
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
