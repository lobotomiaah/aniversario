const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const con = mysql.createConnection(process.env.MYSQL_URL || {
    host: process.env.MYSQLHOST || process.env.MYSQL_HOST,
    user: process.env.MYSQLUSER || process.env.MYSQL_USER,
    password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE,
    port: process.env.MYSQLPORT || 3306
});


app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.get('/lista', (req, res) => {
    const sql = "SELECT * FROM CONVIDADOS";
    con.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar convidados:", err);
            return res.status(500).send("Erro ao buscar convidados.");
        }

  
        let html = `
            <style>
                body { font-family: sans-serif; padding: 20px; background: #121212; color: white; }
                ul { list-style: none; padding: 0; }
                li { background: #1e1e1e; margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed; }
                a { color: #a78bfa; text-decoration: none; }
            </style>
            <h1>Lista de Convidados</h1>
            <ul>
        `;

        results.forEach(c => {
            html += `<li><strong>${c.nome}</strong> confirmou ${c.quantidade} pessoa(s).</li>`;
        });

        html += "</ul><br><a href='/'>← Voltar para o início</a>";
        res.send(html);
    });
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
        if (err) console.error("Erro ao criar tabela:", err);
        else console.log("Tabela pronta!");
    });
});

app.post('/confirmar', (req, res) => {
    const { nome, total } = req.body;

    if (!nome || !total) {
        return res.status(400).send("Preencha todos os campos");
    }

    const sql = "INSERT INTO CONVIDADOS (nome, quantidade) VALUES (?, ?)";
    con.query(sql, [nome, total], (err) => {
        if (err) {
            console.error("Erro no INSERT:", err);
            return res.status(500).send("Erro ao salvar no banco.");
        }
        res.send("Presença confirmada com sucesso!");
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});