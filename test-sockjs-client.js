process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Ohitetaan TLS-sertifikaatin tarkistus (vain kehityskäytössä)

const SockJS = require('sockjs-client');

const sock = new SockJS('https://localhost:3000/websocket'); // Käytetään porttia 3000 ja HTTPS:ää

sock.onopen = function() {
    console.log('SockJS-yhteys avattu');
    sock.send('getStatus');
};

sock.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log('Vastaanotettu:', data);
    sock.close();  // Sulje SockJS-yhteys viestin vastaanottamisen jälkeen
};

sock.onerror = function(e) {
    console.error('SockJS-virhe:', e);
};

sock.onclose = function() {
    console.log('SockJS-yhteys suljettu');
};
