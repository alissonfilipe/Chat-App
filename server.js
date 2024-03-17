const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Definindo pasta estática para servir arquivos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal para servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Array para armazenar nomes de usuários conectados
let connectedUsers = [];

// Evento de conexão do Socket.io
io.on('connection', (socket) => {
    console.log('Usuário conectado');

    // Evento para receber o nome do usuário e adicioná-lo ao array
    socket.on('addUser', (username) => {
        socket.username = username;
        connectedUsers.push(username);
        io.emit('userConnected', username);
    });

    // Evento para enviar mensagem
    socket.on('sendMessage', (message) => {
        io.emit('message', { username: socket.username, message });
    });

    // Evento de desconexão do usuário
    socket.on('disconnect', () => {
        if (socket.username) {
            connectedUsers = connectedUsers.filter(user => user !== socket.username);
            io.emit('userDisconnected', socket.username);
        }
    });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
