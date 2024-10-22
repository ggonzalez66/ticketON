require('dotenv').config();
const path = require('path');
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();
const port = 3001;

// Configurar la conexión a PostgreSQL con DOTENV
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, '../ticketon/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ticketon/build', 'index.html'));
});

// Ruta para crear un ticket con validaciones
app.post('/tickets', async (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        return res.status(400).send('Content-Type must be application/json');
    }

    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).send('Request must include title and description');
    }

    try {
        const result = await pool.query(
            'INSERT INTO ticket (titulo, descripcion) VALUES ($1, $2) RETURNING *',
            [title, description]
        );

        const ticket = result.rows[0];

        const responseHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ticket Created</title>
            </head>
            <body>
                <h1>Ticket Created</h1>
                <p><strong>Title:</strong> ${ticket.titulo}</p>
                <p><strong>Description:</strong> ${ticket.descripcion}</p>
            </body>
            </html>
        `;

        res.status(201).send(responseHTML);
    } catch (error) {
        console.error('Error inserting ticket:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Request must include username, email, and password');
    }

    try {
        // Hash la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO usuarios (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        const user = result.rows[0];

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta para login de usuario
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Request must include username and password');
    }

    try {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE username = $1',
            [username]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(400).send('User not found');
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).send('Invalid password');
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
