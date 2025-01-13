# Setup del Progetto AnonMatch

## Requisiti

- Node.js (versione 18 o superiore)
- npm (Node Package Manager)

# Installazione Node.js e nvm (macOS e Linux)

## Installazione Node.js
1. Scarica da [https://nodejs.org](https://nodejs.org) e installa (LTS consigliato).
2. Verifica l'installazione:
   ```bash
   node -v
   npm -v
Installazione nvm

Installa nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
Aggiungi nvm al profilo della shell:
bash: ~/.bash_profile
zsh: ~/.zshrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
Ricarica:
source ~/.bash_profile  # o ~/.zshrc
Verifica:
nvm --version


---

## Setup del Server (Backend)

1. **Inizializzare il progetto**:

   ```bash
   npm init -y

    Installare le dipendenze:

npm install express cors dotenv

Avviare il server:

    node server.js

Setup del Client (Frontend React)

    Inizializzare il progetto manualmente:

npm init -y
npm install react react-dom
npm install react-scripts
npm install @testing-library/react @testing-library/jest-dom @testing-library/user-event web-vitals
Modifica permanente per OpenSSL3 (se necessario):

Per risolvere il problema con Webpack e OpenSSL3, modifica il package.json aggiungendo la variabile di ambiente nella sezione degli script:

    Aggiungi la variabile di ambiente in package.json:

    Nel file package.json, sotto la sezione "scripts", aggiungi:

    "scripts": {
      "start": "SET NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
      "build": "SET NODE_OPTIONS=--openssl-legacy-provider && react-scripts build",
      "test": "SET NODE_OPTIONS=--openssl-legacy-provider && react-scripts test",
      "eject": "react-scripts eject"
    }

    Nota: SET NODE_OPTIONS=--openssl-legacy-provider è valido su Windows. Su Linux o macOS, usa export NODE_OPTIONS=--openssl-legacy-provider come mostrato precedentemente.

Avviare il client di sviluppo React:

    npm start

Troubleshooting: Errore OpenSSL3 con Node.js 17+
Soluzione Temporanea

Sul terminale dove si lancia il server, impostare la variabile di ambiente:

export NODE_OPTIONS=--openssl-legacy-provider

Avviare il server node:

    node server.js    

Soluzione Permanente
Metodo 1: Aggiungere nel file .bashrc o .bash_profile (per bash)

    Modifica il file:

nano ~/.bashrc

Aggiungi la variabile di ambiente:

export NODE_OPTIONS=--openssl-legacy-provider

Ricarica il file:

    source ~/.bashrc

## Passaggi per l'installazione

1. **Backend**:
   - Naviga nella cartella `backend/` e installa le dipendenze necessarie:
   
   ```bash
   npm install bcryptjs jsonwebtoken

    Frontend:
        Naviga nella cartella client/ e installa axios per le richieste HTTP:

npm install axios

Per abilitare CORS nel server, è stato utilizzato il middleware `cors` in `server.js`, che consente le richieste cross-origin dal client React. Dopo aver avviato il server, puoi registrarti con successo e vedere il token di autenticazione nella risposta. Per verificare la registrazione, apri la console di Firefox con `Ctrl + Shift + I`, dove vedrai un messaggio di successo con il token salvato nel `localStorage`.

# 1. Installazione di PostgreSQL in Locale

## 1.1 macOS
Installa PostgreSQL con Homebrew:

```bash
brew install postgresql
brew services start postgresql
Verifica l'installazione:

psql --version
1.2 Linux (Ubuntu/Debian)

Installa PostgreSQL:

sudo apt update
sudo apt install postgresql postgresql-contrib
Verifica l'installazione:

psql --version
1.3 Windows

Scarica PostgreSQL da PostgreSQL.org e segui le istruzioni.

Verifica l'installazione:

psql --version
2. Creazione del Database e delle Tabelle

Accedi alla shell di PostgreSQL:
psql -U postgres
Crea il database:
CREATE DATABASE anonmatch;
Connettiti al database appena creato:
\c anonmatch
Crea le tabelle:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    situation VARCHAR(50),  -- Nuovo campo per la situazione
    orientation VARCHAR(50), -- Nuovo campo per l'orientamento
    birthday DATE,           -- Nuovo campo per la data di nascita
    gender VARCHAR(50),      -- Nuovo campo per il genere
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_email VARCHAR(100),
    receiver_email VARCHAR(100),
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_email) REFERENCES users(email),
    FOREIGN KEY (receiver_email) REFERENCES users(email)
);
Verifica la creazione delle tabelle:
\dt
Verifica che ci sono gli utenti:
\x
SELECT * FROM users;

3. Passaggio a AWS RDS

3.1 Creazione Database su AWS RDS

Vai su AWS RDS > Create Database.
Seleziona PostgreSQL e configura il database:
DB instance identifier: anonmatch-db
Username: postgres
Password: scegli una password sicura.
Salva l'endpoint del database.
3.2 Modifica del Codice per AWS RDS

Installa le dipendenze per il backend (Node.js):
npm install pg bcryptjs jsonwebtoken
Configura la connessione al database RDS: modifica il file di configurazione per collegarti al database su AWS RDS (es. server.js).
3.3 Replica del Database su AWS RDS

Crea un dump del DB locale:
pg_dump -U postgres -h localhost anonmatch > anonmatch_backup.sql
Carica il dump su AWS RDS: Dopo aver configurato correttamente l'endpoint e le credenziali, carica il backup nel database di AWS RDS:
psql -h your-rds-endpoint -U postgres -d anonmatch -f anonmatch_backup.sql