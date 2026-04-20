require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const con = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
con.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }

    console.log('Conectado ao MySQL!');

    con.query(`
        CREATE TABLE IF NOT EXISTS CONVIDADOS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255),
            quantidade INT
        )
    `, (err) => {
        if (err) console.error(err);
        else console.log("Tabela pronta!");
    });
});

app.post('/confirmar', (req, res) => {
    if (!req.body) {
        return res.status(400).send("Body vazio");
    }

    const { nome, total } = req.body;

    if (!nome || !total) {
        return res.status(400).send("Preencha todos os campos");
    }

    const sql = "INSERT INTO CONVIDADOS (nome, quantidade) VALUES (?, ?)";

    con.query(sql, [nome, total], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao salvar no banco.");
        }

        res.send("Presença confirmada com sucesso!");
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});