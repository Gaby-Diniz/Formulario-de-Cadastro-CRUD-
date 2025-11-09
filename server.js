const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configura o body-parser para ler dados em JSONs
app.use(bodyParser.json());

// Configura a conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // coloque seu usuário do MySQL
  password: '',        // coloque sua senha do MySQL (se tiver)
  database: 'cadastro' // nome do seu banco de dados
});

// Testa a conexão
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Conectado ao banco MySQL com sucesso!');
  }
});

// Rota inicial
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Inicia o servidor'
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
