// server-status.js

async function checkServerStatus() {
    try {
        const response = await fetch('http://localhost:4000/api/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const text = await response.text();
        console.log("Raaka vastaus:", text);
        document.getElementById('raw_result').innerText = text; // Näytä raaka vastausteksti
        const data = JSON.parse(text);
        if (data.status === "OK") {
            document.getElementById('server-status').textContent = 'Status OK';
            document.getElementById('server-status').className = 'status-ok';
        } else {
            document.getElementById('server-status').textContent = 'Server is down';
            document.getElementById('server-status').className = 'status-down';
        }
    } catch (error) {
        document.getElementById('server-status').textContent = 'Server is down';
        document.getElementById('server-status').className = 'status-down';
        console.error('Fetch-virhe:', error);
    }
}

window.onload = checkServerStatus;
