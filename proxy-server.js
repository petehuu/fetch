const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());  // Use the cors middleware

// Proxy endpoint to forward requests to your Express server
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000',  // Your Express server
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''  // Remove "/api" from the proxied request path
    }
}));

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
