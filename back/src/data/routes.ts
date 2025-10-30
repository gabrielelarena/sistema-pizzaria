import express from 'express';
import { pool } from './db';
import { Cliente, Pedido } from './models';

const router = express.Router();

router.post('/enviar-pedido', async (req, res) => {
  const { cliente, pedidos }: { cliente: Cliente; pedidos: Pedido[] } = req.body;

  console.log("Recebido do frontend:", { cliente, pedidos });
  
  try {
    const result = await pool.query(
      `INSERT INTO clientes (cpf, nome, telefone, endereco, pagamento)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [cliente.cpf, cliente.nome, cliente.telefone, cliente.endereco, cliente.pagamento]
    );

    const clienteId = result.rows[0].id;

    for (const p of pedidos) {
      console.log("Pedido recebido:", JSON.stringify(p, null, 2));
      console.log("Data recebida:", p.data_pedido);
      console.log("Tipo da data no backend:", typeof p.data_pedido, p.data_pedido);
      console.log("Valores enviados:", [
        clienteId,
        cliente.cpf,
        p.pizza,
        p.tamanho,
        p.quantidadePizza,
        p.bebida,
        p.quantidadeBebida,
        p.data_pedido
      ]);
      await pool.query(
  `INSERT INTO pedidos (
    cliente_id, cpf, pizza, tamanho, quantidade_pizza, bebida, quantidade_bebida, data_pedido
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
  [
    clienteId,
    cliente.cpf,
    p.pizza,
    p.tamanho,
    p.quantidadePizza,
    p.bebida,
    p.quantidadeBebida,
    p.data_pedido // já vem como 'YYYY-MM-DD'
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
