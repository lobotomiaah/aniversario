require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 


let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


con.connect(function(err){
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});


app.post('/confirmar', (req, res) => {
    const { nome, total } = req.body;
    const sql = "INSERT INTO CONVIDADOS (nome, quantidade) VALUES (?, ?)";

    con.query(sql, [nome, total], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).send("Erro ao salvar no banco.");
        }
        res.send("Presença confirmada com sucesso!");
    });
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});