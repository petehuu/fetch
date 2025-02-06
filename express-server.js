const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Allow CORS for all routes for debugging purposes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Tarjotaan staattiset tiedostot root-hakemistosta
app.use(express.static(path.join(__dirname, '/')));

// Reitti lukemaan status.json
app.get('/status', (req, res) => {
    console.log('GET /status called');
    fs.readFile(path.join(__dirname, 'status.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Reitti päivittämään status.json
app.post('/update-status', (req, res) => {
    console.log('POST /update-status called');
    const newStatus = req.body;
    fs.writeFile(path.join(__dirname, 'status.json'), JSON.stringify(newStatus, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error writing file');
        } else {
            res.send('File updated successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
