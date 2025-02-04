const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    credentials: true,
}));

// Reitti hakea tiedoston GitHub Pages -sivulta
app.get('/fetch-page', async (req, res) => {
    try {
        const response = await fetch('https://petehuu.github.io/fetch/index.html');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        console.error('Error fetching page:', error);
        res.status(500).send('Error fetching page');
    }
});

// Tarjoa staattiset tiedostot
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
