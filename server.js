const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const usersFilePath = path.join(__dirname, 'users.json');

app.use(express.json());

// Читаем юзеров
const readUsersFromFile = () => {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
};

// запись юзеров
const writeUsersToFile = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// все юзеры
app.get('/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});

// юзеры по ID
app.get('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).send('Пользователь не найден');
    }
    
    res.json(user);
});

// новый юзер
app.post('/users', (req, res) => {
    const users = readUsersFromFile();
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    
    users.push(newUser);
    writeUsersToFile(users);
    
    res.status(201).json(newUser);
});

// обновление юзера
app.put('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).send('Пользователь не найден');
    }
    
    users[userIndex] = { id: parseInt(req.params.id), ...req.body };
    writeUsersToFile(users);
    
    res.json(users[userIndex]);
});

// Удаление юзера
app.delete('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).send('Пользователь не найден');
    }
    
    const deletedUser = users.splice(userIndex, 1);
    writeUsersToFile(users);
    
    res.json(deletedUser);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
