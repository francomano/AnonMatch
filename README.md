# Setup del Progetto AnonMatch

## Requisiti
- **Node.js** (versione 18 o superiore)
- **npm** (Node Package Manager)

---

## Installazione di Node.js e nvm (macOS e Linux)

### Installazione di Node.js
1. Scarica Node.js da [https://nodejs.org](https://nodejs.org) (consigliato LTS).
2. Verifica l'installazione:
   ```bash
   node -v
   npm -v
   ```

### Installazione di nvm
1. Installa nvm:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```

2. Aggiungi nvm al profilo della shell:
   - **Bash**:
     ```bash
     echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bash_profile
     echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bash_profile
     source ~/.bash_profile
     ```
   - **Zsh**:
     ```bash
     echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
     echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
     source ~/.zshrc
     ```

3. Verifica l'installazione di nvm:
   ```bash
   nvm --version
   ```

---

## Setup del Server (Backend)

1. **Inizializzare il progetto**:
   ```bash
   npm init -y
   ```

2. **Installare le dipendenze**:
   ```bash
   npm install express cors dotenv
   ```

3. **Avviare il server**:
   ```bash
   node server.js
   ```

---

## Setup del Client (Frontend React)

1. **Inizializzare il progetto**:
   ```bash
   npm init -y
   ```

2. **Installare le dipendenze**:
   ```bash
   npm install react react-dom
   npm install react-scripts
   npm install @testing-library/react @testing-library/jest-dom @testing-library/user-event web-vitals
   ```

3. **Modifica permanente per OpenSSL3 (se necessario)**:
   - Nel file `package.json`, sotto la sezione `"scripts"`, aggiungi:
     ```json
     "scripts": {
       "start": "SET NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
       "build": "SET NODE_OPTIONS=--openssl-legacy-provider && react-scripts build",
       "test": "SET NODE_OPTIONS=--openssl-legacy-provider && react-scripts test",
       "eject": "react-scripts eject"
     }
     ```
   - **Nota**: su macOS/Linux usa `export NODE_OPTIONS=--openssl-legacy-provider`.

4. **Avviare il client di sviluppo React**:
   ```bash
   npm start
   ```

---

## Installazione di PostgreSQL in Locale

### macOS
1. Installa PostgreSQL con Homebrew:
   ```bash
   brew install postgresql
   brew services start postgresql
   ```

2. Verifica l'installazione:
   ```bash
   psql --version
   ```

### Linux (Ubuntu/Debian)
1. Installa PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. Verifica l'installazione:
   ```bash
   psql --version
   ```

### Windows
1. Scarica PostgreSQL da [https://www.postgresql.org/](https://www.postgresql.org/) e segui le istruzioni di installazione.

2. Verifica l'installazione:
   ```bash
   psql --version
   ```

---

## Creazione del Database e delle Tabelle

1. Accedi alla shell di PostgreSQL:
   ```bash
   psql -U postgres
   ```

2. Se ottieni l'errore `FATAL: Peer authentication failed for user 'postgres'`, usa:
   ```bash
   sudo -i -u postgres
   psql
   ```

3. Modifica la password dell'utente `postgres`:
   ```sql
   ALTER USER postgres PASSWORD 'm1ll10n3r3';
   ```

4. Crea il database:
   ```sql
   CREATE DATABASE anonmatch;
   ```

5. Connettiti al database appena creato:
   ```sql
   \c anonmatch
   ```

6. Crea le tabelle:
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100),
       email VARCHAR(100) UNIQUE,
       password VARCHAR(255),
       situation VARCHAR(50),
       orientation VARCHAR(50),
       birthday DATE,
       gender VARCHAR(50),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       user_status VARCHAR(255),
       nationality VARCHAR(100),
       city VARCHAR(100),
       music_genre VARCHAR(100),
       movie_genre VARCHAR(100),
       favorite_sport VARCHAR(100),
       description TEXT,
       profile_picture VARCHAR(255)
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
   ```

7. Verifica le tabelle create:
   ```sql
   \dt
   ```

8. Verifica i dati nella tabella `users`:
   ```sql
   SELECT * FROM users;
   ```

---

## Passaggio a AWS RDS

### Creazione del Database su AWS RDS
1. Vai su **AWS RDS > Create Database**.
2. Seleziona **PostgreSQL** e configura:
   - **DB instance identifier**: anonmatch-db
   - **Username**: postgres
   - **Password**: scegli una password sicura.
3. Salva l'endpoint del database.

### Modifica del Codice per AWS RDS
1. Installa le dipendenze per il backend:
   ```bash
   npm install pg bcryptjs jsonwebtoken
   ```

2. Modifica il file di configurazione del backend per collegarti al database RDS.

### Replica del Database su AWS RDS
1. Crea un dump del database locale:
   ```bash
   pg_dump -U postgres -h localhost anonmatch > anonmatch_backup.sql
   ```

2. Carica il dump su AWS RDS:
   ```bash
   psql -h your-rds-endpoint -U postgres -d anonmatch -f anonmatch_backup.sql
   ```
