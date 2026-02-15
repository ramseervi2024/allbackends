const express = require('express');
const app = express();

// Use environment port if available (for production)
const port = process.env.PORT || 3000;

app.use(express.json());

// Sample in-memory data
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
];

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'USER HOME PAGE' });
});

// Get all users
app.get('/users', (req, res) => {
    res.json(users);
});

// Get single user by ID
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
});

// Create new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name,
        email
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// Update user
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
    }

    users[userIndex] = {
        ...users[userIndex],
        name,
        email
    };

    res.json(users[userIndex]);
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    users.splice(userIndex, 1);
    res.status(204).send();
});

// Start server (IMPORTANT for EC2)
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
});
