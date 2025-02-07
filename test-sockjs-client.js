const SockJS = require('sockjs-client');

const sock = new SockJS('http://localhost/websocket');

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
