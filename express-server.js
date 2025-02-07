const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 3000;

// Käytä cors-middlewarea
app.use(cors());

// Aseta staattiset tiedostot
app.use(express.static(path.join(__dirname, '/')));

// WebSocket-palvelin
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket-yhteys muodostettu');

    ws.on('message', (message) => {
        console.log('Vastaanotettu:', message);
        // Käsittele WebSocket-viesti ja vastaa
        if (message === 'getStatus') {
            fs.readFile(path.join(__dirname, 'status.json'), 'utf8', (err, data) => {
                if (err) {
                    console.error('Virhe luettaessa tiedostoa:', err);
                    ws.send(JSON.stringify({ status: 'error', message: 'Virhe luettaessa tiedostoa' }));
                } else {
                    ws.send(data);
                }
            });
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket-virhe:', error);
    });
});

server.listen(port, () => {
    console.log(`Serveri käynnissä osoitteessa http://localhost:${port}`);
});
