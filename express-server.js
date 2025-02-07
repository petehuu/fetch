const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());  // Käytä cors-middlewarea

// Manuaalinen CORS-otsikoiden asettaminen (varmuuden vuoksi)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.static(path.join(__dirname, '/')));

app.get('/status', (req, res) => {
    fs.readFile(path.join(__dirname, 'status.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Virhe luettaessa tiedostoa:', err);
            res.status(500).send('Virhe luettaessa tiedostoa');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.listen(port, () => {
    console.log(`Serveri käynnissä osoitteessa http://localhost:${port}`);
});
