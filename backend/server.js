const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000', // Permetti richieste dal frontend React
  methods: ['GET', 'POST'], // Puoi anche aggiungere metodi aggiuntivi, se necessario
  allowedHeaders: ['Content-Type', 'Authorization'], // Gli headers che il server è disposto ad accettare
};

app.use(cors(corsOptions));
//app.use(cors());
app.use(express.json());

// Routes
app.use('/api/example', require('./routes/example'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

