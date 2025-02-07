const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const http = require('http');

const app = express();
const port = 4000; // Käytetään porttia 4000

// Käytä cors-middlewarea
app.use(cors());

// Aseta staattiset tiedostot
app.use(express.static(path.join(__dirname, '/')));

// Lisää `/api/status` reitti
app.get('/api/status', (req, res) => {
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

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Serveri käynnissä osoitteessa http://localhost:${port}`);
});
