const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());  // Use the cors middleware

// Middleware to set CORS headers manually
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Proxy endpoint to forward requests to your Express server
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000',  // Your Express server
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''  // Remove "/api" from the proxied request path
    },
    onProxyReq: (proxyReq, req, res) => {
        // Log the proxy request
        console.log('Proxy request:', req.method, req.url);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Log the proxy response
        console.log('Proxy response:', proxyRes.statusCode);
    }
}));

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
