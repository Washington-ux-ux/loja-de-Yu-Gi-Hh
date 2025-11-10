// setup-db.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Cria ou abre o banco de dados (um arquivo chamado banco.db)
const db = new sqlite3.Database('./banco.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado ao banco de dados SQLite.');
});

// Cria a tabela de usuários e insere um usuário de teste
db.serialize(() => {
    // 1. Cria a tabela (se ela não existir)
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL
    )`, (err) => {
        if (err) return console.error("Erro ao criar tabela:", err.message);
        console.log("Tabela 'usuarios' verificada/criada.");
    });

    // 2. Criptografa a senha
    const senhaLimpa = '123456'; // Senha do usuário de teste
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(senhaLimpa, salt);

    // 3. Insere um usuário de teste (só se 'admin' não existir)
    const sqlInsert = `INSERT INTO usuarios (usuario, senha_hash)
                       SELECT ?, ?
                       WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE usuario = ?)`;
    
    db.run(sqlInsert, ['admin', hash, 'admin'], function(err) {
        if (err) return console.error("Erro ao inserir usuário:", err.message);
        
        if(this.changes > 0) {
            console.log(`Usuário 'admin' (senha: '${senhaLimpa}') criado com sucesso!`);
        } else {
            console.log("Usuário 'admin' já existe.");
        }
    });
});

// Fecha a conexão
db.close((err) => {
    if (err) console.error(err.message);
    console.log('Conexão com o banco fechada.');
});