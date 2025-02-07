const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
    console.log('WebSocket-yhteys avattu');
    ws.send('getStatus');
});

ws.on('message', function message(data) {
    console.log('Vastaanotettu:', data);
});

ws.on('error', function error(error) {
    console.error('WebSocket-virhe:', error);
});

ws.on('close', function close(code, reason) {
    console.log(`WebSocket-yhteys suljettu. Koodi: ${code}, Syy: ${reason}`);
});
