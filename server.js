require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const con = mysql.createConnection(process.env.MYSQL_URL);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 
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