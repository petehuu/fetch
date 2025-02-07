const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());  // Käytä cors-middlewarea

// Lokitiedot kaikista pyynnöistä
app.use((req, res, next) => {
    console.log(`Pyynnön URL: ${req.url}, Metodi: ${req.method}`);
    next();
});

// Palvele `server-status.js` tiedostoa käyttäen `/src` polkua
app.use('/src', express.static(path.join(__dirname, '/')));

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

// Proxy-pyynnöt
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000',  // Express-server
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''  // Poista "/api" proxytetun pyynnön polusta
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxy-pyyntö:', req.method, req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log('Proxy-vastaus:', proxyRes.statusCode);
        res.setHeader('Access-Control-Allow-Origin', '*');  // Salli pyynnöt mistä tahansa alkuperästä
    }
}));

// Virheiden käsittely
app.use((err, req, res, next) => {
    console.error('Käsittelemätön virhe:', err);
    res.status(500).send('Odottamaton virhe tapahtui');
});

app.listen(port, () => {
    console.log(`Proxy-serveri käynnissä osoitteessa http://localhost:${port}`);
});
