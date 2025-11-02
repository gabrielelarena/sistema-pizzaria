import express from 'express';
import { pool } from './db.js';
import { Cliente, Pedido } from './models';

const router = express.Router();

router.post('/enviar-pedido', async (req, res) => {
  const { cliente, pedidos }: { cliente: Cliente; pedidos: Pedido[] } = req.body;

  console.log("Recebido do frontend:", { cliente, pedidos });

  try {
    // Insere cliente
    const clienteResult = await pool.query(
      `INSERT INTO clientes (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [cliente.cpf, cliente.nome, cliente.telefone, cliente.endereco]
    );

    const clienteId = clienteResult.rows[0].id;

    // Insere pedidos
    for (const p of pedidos) {
      await pool.query(
        `INSERT INTO pedidos (
          cliente_id, cpf, data_pedido, pizza, quantidade_pizza, tamanho,
          bebida, quantidade_bebida, sobremesa, quantidade_sobremesa,
          observacoes, forma_pagamento, preco_total, cupom
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14
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
          p.observacoes,
          p.forma_pagamento,
          p.preco_total,
          p.cupom,
        ]
      );
    }

      res.status(200).json({ message: 'Pedido armazenado com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      res.status(500).json({ error: 'Erro ao salvar pedido.' });
    }
  });

export default router;