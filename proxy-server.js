const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());  // Käytä cors-middlewarea

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
