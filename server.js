const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080; 

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 1. Criando o Pool de conexões (resolve o erro de "connection closed")
const pool = mysql.createPool(process.env.MYSQL_URL || {
    host: process.env.MYSQLHOST || process.env.MYSQL_HOST,
    user: process.env.MYSQLUSER || process.env.MYSQL_USER,
    password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 2. Testando a conexão e criando a tabela (agora SEM Auto Increment)
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ ERRO AO CONECTAR:', err.message);
        return;
    }
    console.log('✅ Conectado ao MySQL via Pool!');

    const sqlCreateTable = `
        CREATE TABLE IF NOT EXISTS CONVIDADOS (
            id INT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            quantidade INT NOT NULL
        )
    `;

    connection.query(sqlCreateTable, (err) => {
        connection.release(); // Libera a conexão de volta
        if (err) console.error("❌ Erro ao configurar tabela:", err.message);
        else console.log("🚀 Tabela CONVIDADOS pronta (ID manual ativado)!");
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 3. Rota de Confirmação com o ID gerado pelo Node.js
app.post('/confirmar', (req, res) => {
    const { nome, total } = req.body;

    if (!nome || total === undefined) {
        return res.status(400).send("Preencha todos os campos");
    }

    // Gerando um ID numérico aleatório para ignorar o banco
    const idGerado = Math.floor(Math.random() * 999999) + 1;

    // Enviando o ID, nome e quantidade
    const sql = "INSERT INTO CONVIDADOS (id, nome, quantidade) VALUES (?, ?, ?)";
    
    pool.query(sql, [idGerado, nome, total], (err) => {
        if (err) {
            console.error("❌ Erro no INSERT:", err.message);
            return res.status(500).send("Erro ao salvar no banco.");
        }
        res.send("Presença confirmada com sucesso!");
    });
});

app.get('/lista', (req, res) => {
    const sql = "SELECT * FROM CONVIDADOS";
    pool.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Erro ao buscar:", err.message);
            return res.status(500).send("Erro ao buscar convidados.");
        }

        let html = `
            <style>
                body { font-family: sans-serif; padding: 20px; background: #121212; color: white; text-align: center; }
                ul { list-style: none; padding: 0; max-width: 500px; margin: 0 auto; }
                li { background: #1e1e1e; margin-bottom: 10px; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed; display: flex; justify-content: space-between; }
                a { color: #a78bfa; text-decoration: none; font-weight: bold; }
                .badge { background: #7c3aed; padding: 2px 8px; border-radius: 4px; font-size: 0.9em; }
            </style>
            <h1>Lista de Convidados 📝</h1>
            <ul>
        `;

        results.forEach(c => {
            html += `<li><span>👤 ${c.nome}</span> <span class="badge">${c.quantidade} pessoas</span></li>`;
        });

        html += "</ul><br><a href='/'>← Voltar para o início</a>";
        res.send(html);
    });
});

app.listen(port, () => {
    console.log(`📡 Servidor online na porta ${port}`);
});