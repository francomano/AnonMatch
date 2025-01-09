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
