const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Tarjotaan staattiset tiedostot public-kansiosta
app.use(express.static(path.join(__dirname, 'public')));

let checkAttempts = 0;
const maxAttempts = 6;
const interval = 10000; // 10 sekuntia

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

const checkServerStatus = () => {
    const http = require('http');

    const options = {
        host: 'localhost',
        port: port,
        path: '/status',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const status = JSON.parse(data).status;
            console.log(`Status check ${checkAttempts + 1}: ${status}`);
            if (status !== 'OK') {
                checkAttempts++;
                if (checkAttempts >= maxAttempts) {
                    console.log(`Max attempts reached. Shutting down server.`);
                    process.exit(1);
                }
            } else {
                checkAttempts = 0; // Reset attempts if status is OK
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Request error: ${e.message}`);
        checkAttempts++;
        if (checkAttempts >= maxAttempts) {
            console.log(`Max attempts reached. Shutting down server.`);
            process.exit(1);
        }
    });

    req.end();
};

// Käynnistetään varmistus
setInterval(checkServerStatus, interval);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
