process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ohitetaan TLS-sertifikaatin tarkistus (vain kehityskäytössä)

const WebSocket = require('ws');

const ws = new WebSocket('wss://localhost:3000'); // Käytetään WebSocket-yhteyttä HTTPS:llä

ws.on('open', function open() {
    console.log('WebSocket-yhteys avattu');
    ws.send('getStatus');
});

ws.on('message', function message(data) {
    const parsedData = JSON.parse(data);
    console.log('Vastaanotettu:', parsedData);
    ws.close();  // Sulje WebSocket-yhteys viestin vastaanottamisen jälkeen
});

ws.on('error', function error(e) {
    console.error('WebSocket-virhe:', e);
});

ws.on('close', function close() {
    console.log('WebSocket-yhteys suljettu');
});
