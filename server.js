const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});


async function initDb() {
    try {
        await client.execute(`
            CREATE TABLE IF NOT EXISTS CONVIDADOS (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                quantidade INTEGER NOT NULL
            );
        `);
        console.log("🚀 Banco Turso pronto e tabela configurada!");
    } catch (err) {
        console.error("❌ Erro ao iniciar banco:", err.message);
    }
}
initDb();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/confirmar', async (req, res) => {
    const { nome, total } = req.body;
    const qtd = total || 1;

    if (!nome || qtd === undefined) {
        return res.status(400).send("O nome é obrigatorio");
    }

    try {
        await client.execute({
            sql: "INSERT INTO CONVIDADOS (nome, quantidade) VALUES (?, ?)",
            args: [nome, qtd]
        });
        console.log(`✅ ${nome} confirmado!`);
        res.send("Presença confirmada com sucesso!");
    } catch (err) {
        console.error("❌ Erro no INSERT:", err.message);
        res.status(500).send("Erro no banco: " + err.message);
    }
});

app.get('/lista', async (req, res) => {
    try {
        const result = await client.execute("SELECT * FROM CONVIDADOS");
        
        let html = `<body style="background:#121212;color:white;font-family:sans-serif;text-align:center;">`;
        html += `<h1>Lista de Confirmados 📝</h1><ul>`;
        
        result.rows.forEach(c => {
            html += `<li style="list-style:none;margin:10px;padding:10px;background:#1e1e1e;border-radius:5px;">
                        ${c.nome} - <strong>${c.quantidade} pessoas</strong>
                     </li>`;
        });
        
        html += `</ul><br><a href="/" style="color:#a78bfa;">← Voltar</a></body>`;
        res.send(html);
    } catch (err) {
        res.status(500).send("Erro ao buscar lista: " + err.message);
    }
});

app.listen(port, () => {
    console.log(`📡 Servidor online na porta ${port}`);
});