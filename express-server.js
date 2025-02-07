const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const https = require('https');
const SockJS = require('sockjs');

const app = express();
const port = 443; // Käytetään porttia 443 HTTPS:lle

// Käytä cors-middlewarea
app.use(cors());

// Aseta staattiset tiedostot
app.use(express.static(path.join(__dirname, '/')));

// SockJS-palvelin
const sockjs = SockJS.createServer();
sockjs.on('connection', (conn) => {
    console.log('SockJS-yhteys muodostettu');
    conn.write(JSON.stringify({ message: 'Yhteys muodostettu' })); // Lähetetään vahvistus JSON-muodossa

    conn.on('data', (message) => {
        console.log('Vastaanotettu:', message);
        // Käsittele SockJS-viesti ja vastaa
        if (message === 'getStatus') {
            fs.readFile(path.join(__dirname, 'status.json'), 'utf8', (err, data) => {
                if (err) {
                    console.error('Virhe luettaessa tiedostoa:', err);
                    conn.write(JSON.stringify({ status: 'error', message: 'Virhe luettaessa tiedostoa' }));
                } else {
                    conn.write(data);
                }
            });
        }
    });

    conn.on('error', (error) => {
        console.error('SockJS-virhe:', error);
    });

    conn.on('close', () => {
        console.log('SockJS-yhteys suljettu');
    });
});

// Lataa SSL-sertifikaatti ja avain
const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);
sockjs.installHandlers(server, { prefix: '/websocket' });

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
