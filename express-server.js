const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const https = require('https');
const WebSocket = require('ws');

const app = express();
const port = 3000; // Käytetään porttia 3000

// Käytä cors-middlewarea
app.use(cors());

// Aseta staattiset tiedostot
app.use(express.static(path.join(__dirname, '/')));

// Lataa SSL-sertifikaatti ja avain
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);

// WebSocket-palvelin
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket-yhteys muodostettu');
    ws.send(JSON.stringify({ message: 'Yhteys muodostettu' })); // Lähetetään vahvistus JSON-muodossa

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

    ws.on('close', () => {
        console.log('WebSocket-yhteys suljettu');
    });
});

// Lisää `/status` reitti
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
    console.log(`Serveri käynnissä osoitteessa https://localhost:${port}`);
});
