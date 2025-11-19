import express from 'express';
import { pool } from '../data/db.js'; // Conexão com o banco PostgreSQL
import bcrypt from 'bcrypt'; // Biblioteca para criptografar e comparar senhas

const routerverif = express.Router(); // Cria um roteador do Express

// -----------------------------
// ROTA: POST /verificar
// -----------------------------
routerverif.post('/verificar', async (req, res) => {
  const { cpf, senha } = req.body; // Recebe CPF e senha do corpo da requisição

  // Validação dos campos obrigatórios
  if (!cpf || !senha) {
    return res.status(400).json({ error: 'CPF e senha são obrigatórios.' });
  }

  try {
    // Busca cliente pelo CPF
    const result = await pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);

    if (result.rows.length === 0) {
      // Se não encontrar, retorna erro
      return res.status(404).json({ error: 'Você não tem cadastro, clique em se cadastrar.' });
    }

    const clienteBanco = result.rows[0];

    // 🔑 Compara senha digitada com hash armazenado no banco
    const senhaValida = await bcrypt.compare(senha, clienteBanco.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta. Verifique CPF e senha.' });
    }

    // Retorna dados do cliente (sem expor a senha)
    return res.json({
      message: 'Ok, cadastro existente!',
      clienteBanco: {
        nome: clienteBanco.nome,
        telefone: clienteBanco.telefone,
        endereco: clienteBanco.endereco
      }
    });
  } catch (err) {
    console.error('Erro ao verificar cadastro:', err);
    return res.status(500).json({ error: 'Erro ao verificar cadastro.' });
  }
});

// -----------------------------
// ROTA: GET /verificar-cliente/:cpf
// -----------------------------
routerverif.get('/verificar-cliente/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    // Busca cliente pelo CPF
    const clienteResult = await pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);

    if (clienteResult.rows.length === 0) {
      // Se não existe cliente, retorna existe=false e temPedido=false
      return res.json({ existe: false, temPedido: false });
    }

    // Busca pedidos associados ao CPF
    const pedidosResult = await pool.query('SELECT * FROM pedidos WHERE cpf = $1', [cpf]);

    const temPedido = pedidosResult.rows.length > 0; // Verifica se há pedidos

    return res.json({ existe: true, temPedido });
  } catch (err) {
    console.error('Erro ao verificar cliente/pedido:', err);
    return res.status(500).json({ error: 'Erro ao verificar cliente/pedido.' });
  }
});

// -----------------------------
// ROTA: GET /usar-cadastro/:cpf
// -----------------------------
routerverif.get('/usar-cadastro/:cpf', async (req, res) => {
  const { cpf } = req.params;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF inválido.' });
  }

  try {
    // Busca cliente pelo CPF
    const result = await pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    // ⚠️ Nunca retorne a senha para o cliente
    const { senha, ...clienteSemSenha } = result.rows[0];

    // Retorna dados do cliente sem a senha
    return res.json({ cliente: clienteSemSenha });
  } catch (err) {
    console.error('Erro ao buscar cadastro:', err);
    return res.status(500).json({ error: 'Erro ao buscar cadastro.' });
  }
});

export default routerverif; // Exporta o roteador para ser usado no servidor principal
