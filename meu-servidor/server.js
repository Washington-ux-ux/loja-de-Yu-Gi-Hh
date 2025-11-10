// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3000;

// 1. Middlewares
app.use(cors()); // Permite requisições de outras origens (seu front-end)
app.use(express.json()); // Permite ao Express entender JSON

// 2. Conectar ao Banco de Dados
const db = new sqlite3.Database('./banco.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Servidor conectado ao banco de dados SQLite.');
});

// 3. Rota de Login (a que seu JS chama)
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    console.log(`Tentativa de login para usuário: ${usuario}`);

    // Procura o usuário no banco
    const sql = `SELECT * FROM usuarios WHERE usuario = ?`;
    
    db.get(sql, [usuario], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor.' });
        }

        // Caso 1: Usuário não encontrado
        if (!row) {
            console.log('Falha: Usuário não encontrado.');
            return res.json({ sucesso: false, erro: 'Usuário não encontrado.' });
        }

        // Caso 2: Usuário encontrado, verificar a senha
        // Compara a senha enviada com o hash salvo no banco
        const senhaCorreta = bcrypt.compareSync(senha, row.senha_hash);

        if (senhaCorreta) {
            // Caso 2a: Senha correta
            console.log('Sucesso: Login bem-sucedido.');
            return res.json({ sucesso: true });
        } else {
            // Caso 2b: Senha incorreta
            console.log('Falha: Senha incorreta.');
            return res.json({ sucesso: false, erro: 'Senha incorreta.' });
        }
    });
});

// 4. Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});