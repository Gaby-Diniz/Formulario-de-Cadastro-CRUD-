/**
 * Projeto Node.js com Express + MySQL usando pool de conexões
 * CRUD simples para inserir clientes via formulário HTML
 * 
 * Passos para rodar:
 * 1. Abra o terminal na pasta do projeto
 * 2. Rode: npm init -y
 * 3. Instale dependências: npm i express mysql2
 * 4. Coloque o index.html e CSS na pasta Public
 * 5. Rode o servidor: node server.js
 * 6. Abra no navegador: http://localhost:8080
 */

// Importando pacotes
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

// Criando o servidor Express
const app = express();

// Porta do servidor Express
const port = 8080;

// Servir arquivos estáticos (CSS, imagens, index.html)
app.use(express.static(path.join(__dirname, 'Public')));

// Middleware para capturar dados do corpo de requisições POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Configuração do pool de conexões com MySQL
 * 
 * Usar pool é mais seguro do que uma conexão única:
 * - Garante que cada query tenha uma conexão válida
 * - Evita erros "Can't add new command when connection is in closed state"
 * - Permite múltiplas conexões simultâneas
 */
const pool = mysql.createPool({
    host: '127.0.0.1',     // localhost
    user: 'root',          // usuário do MySQL
    password: '290306Lu.', // senha do MySQL
    database: 'spotudf',   // banco de dados
    port: 3306,            // porta do MySQL
    waitForConnections: true,
    connectionLimit: 10,    // máximo de conexões simultâneas
    queueLimit: 0           // número máximo de requisições na fila (0 = ilimitado)
});

/**
 * Teste de conexão inicial ao iniciar o servidor
 */
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.code, err.address, err.port);
        return;
    }
    console.log('Conectado ao banco de dados via pool.');
    connection.release(); // devolve a conexão para o pool
});

/**
 * Rota GET para servir o formulário HTML
 * Quando o usuário acessar a raiz do site, será carregado o index.html
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

/**
 * Rota POST para inserir cliente
 * Os dados digitados no formulário serão enviados para esta rota
 */
app.post('/inserirCliente', (req, res) => {
    const { nome, email, telefone, endereco } = req.body;

    // Comando SQL para inserir os dados na tabela clientes
    const sql = 'INSERT INTO clientes (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)';

    // Executando a query usando o pool
    pool.query(sql, [nome, email, telefone, endereco], (err) => {
        if (err) {
            console.error('Erro ao inserir os dados do cliente:', err);
            return res.send('Erro ao inserir cliente.');
        }

        // Log no terminal para conferir que os dados chegaram
        console.log('Cliente inserido:', req.body);

        // Redireciona o usuário para a página inicial após inserir
        res.redirect('/');
    });
});

/**
 * Inicializando servidor
 * Para executar a aplicação, rode:
 *      node server.js
 * E abra no navegador:
 *      http://localhost:8080
 */
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

/**
 * Dicas para testar:
 * 1. Abra o site no navegador e preencha o formulário
 * 2. Clique em enviar
 * 3. Verifique no terminal se o log "Cliente inserido" aparece
 * 4. Abra o MySQL Workbench e execute:
 *      SELECT * FROM clientes;
 *    para ver se os dados foram realmente gravados
 */
