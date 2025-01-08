import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  // Effettua una richiesta al backend quando il componente è montato
  useEffect(() => {
    fetch('http://localhost:3001/api/example')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Errore durante la chiamata API:', error));
  }, []); // [] significa che l'effetto sarà eseguito solo una volta, al montaggio del componente

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Benvenuto al Client React</h1>
      <h2>{message || 'Caricamento...'}</h2>
    </div>
  );
}

export default App;
