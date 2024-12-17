const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'top-bank'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        return res.json(results);
    });
});

app.post('/users', (req, res) => {
    const { nome, sobrenome, email, data, senha } = req.body;
    const sql = 'INSERT INTO users (nome, sobrenome, email, data, senha) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nome, sobrenome, email, data, senha], (err, results) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        return res.status(201).json('Usuário criado com sucesso!');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.post('/users/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND senha = ?';
    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao verificar login:', err);
            return res.status(500).json({ message: 'Erro interno do servidor.' });
        }

        if (results.length > 0) {
            return res.status(200).json({ message: 'Login bem-sucedido!', user: results[0] });
        } else {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }
    });
});
