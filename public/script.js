const socket = io();

function connect() {
    const username = document.getElementById('usernameInput').value;
    socket.emit('addUser', username);
    document.getElementById('usernameInput').disabled = true;
}

socket.on('userConnected', (username) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><strong>${username}</strong> se conectou</p>`;
});

socket.on('userDisconnected', (username) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><strong>${username}</strong> se desconectou</p>`;
});

socket.on('message', (data) => {
    const chat = document.getElementById('chat');
    chat.innerHTML += `<p><strong>${data.username}</strong>: ${data.message}</p>`;
});

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    socket.emit('sendMessage', message);
    document.getElementById('messageInput').value = '';
}
