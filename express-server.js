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
    ws.send('Yhteys muodostettu'); // Lähetetään vahvistus yhteydestä

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

    ws.on('close', (code, reason) => {
        console.log(`WebSocket-yhteys suljettu. Koodi: ${code}, Syy: ${reason}`);
    });
});

// Lisää /status reitti
app.get('/status', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.readFile(path.join(__dirname, 'status.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Virhe luettaessa tiedostoa:', err);
            res.status(500).send('Virhe luettaessa tiedostoa');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

server.listen(port, () => {
    console.log(`Serveri käynnissä osoitteessa http://localhost:${port}`);
});
