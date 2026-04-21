const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306,
    connectTimeout: 10000
});


pool.query(`
    CREATE TABLE IF NOT EXISTS CONVIDADOS (
        id INT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        quantidade INT NOT NULL
    )
`, (err) => {
    if (err) console.error("⚠️ Aviso na Tabela:", err.message);
    else console.log("🚀 Banco de dados pronto para uso!");
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/confirmar', (req, res) => {
    const { nome, total } = req.body;
    
  
    const qtd = total || req.body.quantidade;

    if (!nome || qtd === undefined) {
        return res.status(400).send("Erro: Nome ou quantidade faltando.");
    }

    const idManual = Math.floor(Math.random() * 1000000);

    const sql = "INSERT INTO CONVIDADOS (id, nome, quantidade) VALUES (?, ?, ?)";
    
    pool.query(sql, [idManual, nome, qtd], (err) => {
        if (err) {
            console.error("❌ Erro no INSERT:", err.message);
            return res.status(500).send("Erro no banco de dados: " + err.message);
        }
        console.log(`✅ ${nome} confirmado!`);
        res.send("Presença confirmada com sucesso!");
    });
});

app.get('/lista', (req, res) => {
    pool.query("SELECT * FROM CONVIDADOS", (err, results) => {
        if (err) return res.status(500).send("Erro ao listar: " + err.message);
        let lista = results.map(c => `<li>${c.nome} - ${c.quantidade} pessoas</li>`).join('');
        res.send(`<h1>Lista</h1><ul>${lista}</ul><br><a href="/">Voltar</a>`);
    });
});

app.listen(port, () => {
    console.log(`📡 Servidor rodando na porta ${port}`);
});