const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Use the cors middleware

// Tarjotaan staattiset tiedostot root-hakemistosta
app.use(express.static(path.join(__dirname, '/')));

// Middleware to set CORS headers manually
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');  // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
