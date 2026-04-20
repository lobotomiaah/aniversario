require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const con = mysql.createConnection(process.env.MYSQL_URL);

app.use(cors());
app.use(express.json());

con.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }

    console.log('Conectado ao MySQL!');

    // ✅ cria tabela depois de conectar
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
    const { nome, total } = req.body;

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