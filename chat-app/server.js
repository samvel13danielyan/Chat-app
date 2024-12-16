const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = [];  // In-memory user storage (use a real DB in production)
const secretKey = 'your_secret_key';  // Keep this secure in production

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(403).send('Access denied');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files (e.g., your HTML)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered');
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).send('Invalid username or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

let messages = {}; // Store messages per room

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join room', (room, token) => {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                socket.emit('error', 'Invalid token');
                socket.disconnect();
                return;
            }
            socket.username = user.username;
            socket.join(room);
            console.log(`${user.username} joined room: ${room}`);

            // Send previous messages from the room (if any)
            if (messages[room]) {
                socket.emit('chat history', messages[room]);
            }
        });
    });

    // Handle sending a message to a specific room
    socket.on('chat message', (data) => {
        const { room, message } = data;

        if (!socket.username) {
            socket.emit('error', 'User is not authenticated');
            return;
        }

        if (!messages[room]) {
            messages[room] = [];
        }
        messages[room].push({ user: socket.username, message }); // Save user and message

        // Broadcast the message to all clients in the room
        io.to(room).emit('chat message', { user: socket.username, message });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.username} disconnected`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
