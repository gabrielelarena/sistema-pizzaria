import express from 'express';
import { pool } from '../data/db.js';
import { Cliente, Pedido } from '../data/models.js';

const router = express.Router();

// ROTA: Enviar pedido

router.post('/enviar-pedido', async (req, res) => {
  const { cliente, pedidos }: { cliente: Cliente; pedidos: Pedido[] } = req.body;

  console.log("Recebido do frontend:", { cliente, pedidos });
  console.log("Dados recebidos:", JSON.stringify(req.body, null, 2));

  try {
    const enderecoFinal = cliente.endereco?.trim() || "Retirar no local";

    const clienteResult = await pool.query(
      `INSERT INTO clientes (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [cliente.cpf, cliente.nome, cliente.telefone, enderecoFinal]
    );

    const clienteId = clienteResult.rows[0].id;

    for (const p of pedidos) {
      console.log("Inserindo pedido:", p);
      if (!clienteId) {
        throw new Error("clienteId está indefinido");
      }

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
          p.data_pedido,
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
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    return res.status(500).json({ error: 'Erro ao salvar pedido.' });
  }
});

// ROTA: Clientes

router.post('/clientes', async (req, res) => {
  const { cpf, nome, telefone, endereco } = req.body;

  if (!cpf || !nome || !telefone) {
    return res.status(400).json({ error: 'CPF, nome e telefone são obrigatórios.' });
  }

  const enderecoFinal = endereco?.trim() || "Retirar no local";

  try {
    const existe = await pool.query(
      'SELECT * FROM clientes WHERE cpf = $1',
      [cpf]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Cliente já cadastrado com este CPF.' });
    }

    await pool.query(
      'INSERT INTO clientes (cpf, nome, telefone, endereco) VALUES ($1, $2, $3, $4)',
      [cpf, nome, telefone, enderecoFinal]
    );

    return res.status(201).json({ message: 'Cliente cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar cliente.' });
  }
});

router.put('/clientes/:cpf', async (req, res) => {
  const { cpf } = req.params;
  const { nome, telefone, endereco } = req.body;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF inválido para atualização.' });
  }

  const campos: string[] = [];
  const valores: any[] = [];

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

export default router;
