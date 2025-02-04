const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Tarjotaan staattiset tiedostot public-kansiosta
app.use(express.static(path.join(__dirname, 'public')));

// CURS-varmistus middleware
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'https://petehuu.github.io'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Reitti lukemaan status.json
app.get('/status', (req, res) => {
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
