import express from 'express';
import bcrypt from 'bcrypt'; // Biblioteca para criptografar senhas
import { pool } from '../data/db.js'; // Conexão com o banco PostgreSQL
import { Cliente, Pedido } from '../data/models.js'; // Interfaces de tipos

const router = express.Router(); // Cria um roteador do Express

// -----------------------------
// ROTA: Enviar pedido
// -----------------------------
router.post('/enviar-pedido', async (req, res) => {
  // Recebe cliente e pedidos do corpo da requisição
  const { cliente, pedidos }: { cliente: Cliente; pedidos: Pedido[] } = req.body;

  try {
    // Se não houver endereço, define "Retirar no local"
    const enderecoFinal = cliente.endereco?.trim() || "Retirar no local";

    // Insere ou atualiza cliente (ON CONFLICT garante que não duplica CPF)
    const clienteResult = await pool.query(
      `INSERT INTO clientes (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (cpf) DO UPDATE
         SET nome = EXCLUDED.nome,
             telefone = EXCLUDED.telefone,
             endereco = EXCLUDED.endereco
       RETURNING id`,
      [cliente.cpf, cliente.nome, cliente.telefone, enderecoFinal]
    );

    const clienteId = clienteResult.rows[0].id; // Pega o ID do cliente

    // Insere cada pedido associado ao cliente
    for (const p of pedidos) {
      console.log("Inserindo pedido:", p);

      await pool.query(
        `INSERT INTO pedidos (
          cliente_id, cpf, data_pedido, pizza, quantidade_pizza, tamanho,
          bebida, quantidade_bebida, sobremesa, quantidade_sobremesa,
          adicional, quantidade_adicional, observacoes, forma_pagamento, preco_total, cupom
        ) VALUES (
          $1, $2, TO_TIMESTAMP($3, 'DD/MM/YYYY - HH24:MI'), $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16
        )`,
        [
          clienteId,
          p.cpf,
          p.data_pedido, // precisa estar no formato DD/MM/YYYY - HH:MM
          p.pizza,
          p.quantidade_pizza,
          p.tamanho,
          p.bebida,
          p.quantidade_bebida,
          p.sobremesa,
          p.quantidade_sobremesa,
          p.adicional,
          p.quantidade_adicional,
          p.observacoes,
          p.forma_pagamento,
          p.preco_total,
          p.cupom,
        ]
      );
    }

    return res.status(200).json({ message: 'Pedido armazenado com sucesso!' });
  } catch (error: any) {
    console.error('Erro ao salvar pedido:', error.message, error.stack);
    return res.status(500).json({ error: 'Erro ao salvar pedido.' });
  }
});

// -----------------------------
// ROTA: Criar cliente
// -----------------------------
router.post('/clientes', async (req, res) => {
  const { cpf, nome, telefone, endereco, senha } = req.body;

  // Validação dos campos obrigatórios
  if (!cpf || !nome || !telefone || !senha) {
    return res.status(400).json({ error: 'CPF, nome, telefone e senha são obrigatórios.' });
  }

  const enderecoFinal = endereco?.trim() || "Retirar no local";

  try {
    // Verifica se já existe cliente com esse CPF
    const existe = await pool.query('SELECT * FROM clientes WHERE cpf = $1', [cpf]);

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Cliente já cadastrado com este CPF.' });
    }

    // Criptografa a senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere novo cliente
    await pool.query(
      'INSERT INTO clientes (cpf, nome, telefone, endereco, senha) VALUES ($1, $2, $3, $4, $5)',
      [cpf, nome, telefone, enderecoFinal, senhaHash]
    );

    return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
  }
});

// -----------------------------
// ROTA: Atualizar cliente
// -----------------------------
router.put('/clientes/:cpf', async (req, res) => {
  const { cpf } = req.params;
  const { nome, telefone, endereco, senha } = req.body;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF inválido para atualização.' });
  }

  const campos: string[] = [];
  const valores: any[] = [];

  // Monta dinamicamente os campos que serão atualizados
  if (nome) {
    campos.push(`nome = $${valores.length + 1}`);
    valores.push(nome);
  }

  if (telefone) {
    campos.push(`telefone = $${valores.length + 1}`);
    valores.push(telefone);
  }

  if (endereco !== undefined) {
    const enderecoFinal = endereco?.trim() || "Retirar no local";
    campos.push(`endereco = $${valores.length + 1}`);
    valores.push(enderecoFinal);
  }

  if (senha) {
    const senhaHash = await bcrypt.hash(senha, 10);
    campos.push(`senha = $${valores.length + 1}`);
    valores.push(senhaHash);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
  }

  valores.push(cpf);
  const query = `UPDATE clientes SET ${campos.join(', ')} WHERE cpf = $${valores.length}`;

  try {
    await pool.query(query, valores);
    return res.json({ message: 'Cliente atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    return res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  }
});

// -----------------------------
// ROTA: Excluir cliente
// -----------------------------
router.delete('/clientes/:cpf', async (req, res) => {
  const { cpf } = req.params;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF inválido para exclusão.' });
  }

  try {
    await pool.query('DELETE FROM clientes WHERE cpf = $1', [cpf]);
    return res.json({ message: 'Cliente excluído com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir cliente:', err);
    return res.status(500).json({ error: 'Erro ao excluir cliente.' });
  }
});

export default router; // Exporta o roteador para ser usado no servidor principal
