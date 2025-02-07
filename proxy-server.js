const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());  // Käytä cors-middlewarea

// Manuaalinen CORS-otsikoiden asettaminen
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
        res.setHeader('Access-Control-Allow-Origin', '*');
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
