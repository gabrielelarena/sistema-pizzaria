import express from 'express';
import { pool } from './db.js';
import { Cliente, Pedido } from './models.js';

const router = express.Router();

//
// 📦 ROTA: Enviar pedido
//
router.post('/enviar-pedido', async (req, res) => {
  const { cliente, pedidos }: { cliente: Cliente; pedidos: Pedido[] } = req.body;

  console.log("Recebido do frontend:", { cliente, pedidos });
  console.log("Dados recebidos:", JSON.stringify(req.body, null, 2));


  try {
    const clienteResult = await pool.query(
      `INSERT INTO clientes (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [cliente.cpf, cliente.nome, cliente.telefone, cliente.endereco]
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



// Cadastrar pizza (nome, tamanho e preco obrigatórios)
router.post('/pizzas', async (req, res) => {
  const { nome, tamanho, preco } = req.body;

  if (!nome || !tamanho || preco === undefined || preco === null || isNaN(preco)) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, tamanho e preço.' });
  }

  try {
    const existe = await pool.query(
      'SELECT * FROM pizzas WHERE nome = $1 AND tamanho = $2',
      [nome, tamanho]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Essa pizza já existe com esse tamanho.' });
    }

    await pool.query(
      'INSERT INTO pizzas (nome, tamanho, preco) VALUES ($1, $2, $3)',
      [nome, tamanho, preco]
    );

    return res.status(201).json({ message: 'Pizza cadastrada com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar pizza:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar pizza.' });
  }
});

// Atualizar pizza (id obrigatório, campos opcionais)
router.put('/pizzas/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  const { nome, tamanho, preco } = req.body;

  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'ID inválido para atualização.' });
  }

  const campos: string[] = [];
  const valores: any[] = [];

  if (nome) {
    campos.push(`nome = $${valores.length + 1}`);
    valores.push(nome);
  }

  if (tamanho && tamanho !== "Selecione um tamanho:") {
    campos.push(`tamanho = $${valores.length + 1}`);
    valores.push(tamanho);
  }

  if (preco !== undefined && preco !== null && !isNaN(preco)) {
    campos.push(`preco = $${valores.length + 1}`);
    valores.push(preco);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
  }

  valores.push(idNum);
  const query = `UPDATE pizzas SET ${campos.join(', ')} WHERE id = $${valores.length}`;

  try {
    await pool.query(query, valores);
    return res.json({ message: 'Pizza atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar pizza:', err);
    return res.status(500).json({ error: 'Erro ao atualizar pizza.' });
  }
});

// Excluir pizza (somente ID necessário)
router.delete('/pizzas/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);

  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'ID inválido para exclusão.' });
  }

  try {
    await pool.query('DELETE FROM pizzas WHERE id = $1', [idNum]);
    return res.json({ message: 'Pizza excluída com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir pizza:', err);
    return res.status(500).json({ error: 'Erro ao excluir pizza.' });
  }
});

// 🧃 ROTAS: Bebidas

router.post('/bebidas', async (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || preco === undefined || preco === null || isNaN(preco)) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome e preço.' });
  }

  try {
    const existe = await pool.query(
      'SELECT * FROM bebidas WHERE nome = $1',
      [nome]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Essa bebida já está cadastrada.' });
    }

    await pool.query(
      'INSERT INTO bebidas (nome, preco) VALUES ($1, $2)',
      [nome, preco]
    );

    return res.status(201).json({ message: 'Bebida cadastrada com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar bebida:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar bebida.' });
  }
});

router.put('/bebidas/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  const { nome, preco } = req.body;

  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'ID inválido para atualização.' });
  }

  const campos: string[] = [];
  const valores: any[] = [];

  if (nome) {
    campos.push(`nome = $${valores.length + 1}`);
    valores.push(nome);
  }

  if (preco !== undefined && preco !== null && !isNaN(preco)) {
    campos.push(`preco = $${valores.length + 1}`);
    valores.push(preco);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
  }

  valores.push(idNum);
  const query = `UPDATE bebidas SET ${campos.join(', ')} WHERE id = $${valores.length}`;

  try {
    await pool.query(query, valores);
    return res.json({ message: 'Bebida atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar bebida:', err);
    return res.status(500).json({ error: 'Erro ao atualizar bebida.' });
  }
});

router.delete('/bebidas/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);

  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'ID inválido para exclusão.' });
  }

  try {
    await pool.query('DELETE FROM bebidas WHERE id = $1', [idNum]);
    return res.json({ message: 'Bebida excluída com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir bebida:', err);
    return res.status(500).json({ error: 'Erro ao excluir bebida.' });
  }
});










// ROTAS: Sobremesas

router.post('/sobremesas', async (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || preco === undefined || preco === null || isNaN(preco)) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome e preço.' });
  }

  try {
    const existe = await pool.query(
      'SELECT * FROM sobremesas WHERE nome = $1',
      [nome]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Essa sobremesa já está cadastrada.' });
    }

    await pool.query(
      'INSERT INTO sobremesas (nome, preco) VALUES ($1, $2)',
      [nome, preco]
    );

    return res.status(201).json({ message: 'Sobremesa cadastrada com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar sobremesa:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar sobremesa.' });
  }
});

router.put('/sobremesas/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  const { nome, preco } = req.body;

  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'ID inválido para atualização.' });
  }

  const campos: string[] = [];
  const valores: any[] = [];

  if (nome) {
    campos.push(`nome = $${valores.length + 1}`);
    valores.push(nome);
  }

  if (preco !== undefined && preco !== null && !isNaN(preco)) {
    campos.push(`preco = $${valores.length + 1}`);
    valores.push(preco);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
  }

  valores.push(idNum);
  const query = `UPDATE sobremesas SET ${campos.join(', ')} WHERE id = $${valores.length}`;

  try {
    await pool.query(query, valores);
    return res.json({ message: 'Sobremesa atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar sobremesa:', err);
    return res.status(500).json({ error: 'Erro ao atualizar sobremesa.' });
  }
});

router.delete('/sobremesas/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);

  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'ID inválido para exclusão.' });
  }

  try {
    await pool.query('DELETE FROM sobremesas WHERE id = $1', [idNum]);
    return res.json({ message: 'Sobremesa excluída com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir sobremesa:', err);
    return res.status(500).json({ error: 'Erro ao excluir sobremesa.' });
  }
});


// ROTAS: Adicionais

router.post('/adicionais', async (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || preco === undefined || preco === null || isNaN(preco)) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome e preço.' });
  }

  try {
    const existe = await pool.query(
      'SELECT * FROM adicionais WHERE nome = $1',
      [nome]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Esse adicional já está cadastrado.' });
    }

    await pool.query(
      'INSERT INTO adicionais (nome, preco) VALUES ($1, $2)',
      [nome, preco]
    );

    return res.status(201).json({ message: 'Adicional cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar adicional:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar adicional.' });
  }
});

router.put('/adicionais/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);
  const { nome, preco } = req.body;

  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'ID inválido para atualização.' });
  }

  const campos: string[] = [];
  const valores: any[] = [];

  if (nome) {
    campos.push(`nome = $${valores.length + 1}`);
    valores.push(nome);
  }

  if (preco !== undefined && preco !== null && !isNaN(preco)) {
    campos.push(`preco = $${valores.length + 1}`);
    valores.push(preco);
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar foi enviado.' });
  }

  valores.push(idNum);
  const query = `UPDATE adicionais SET ${campos.join(', ')} WHERE id = $${valores.length}`;

  try {
    await pool.query(query, valores);
    return res.json({ message: 'Adicional atualizado com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar adicional:', err);
    return res.status(500).json({ error: 'Erro ao atualizar adicional.' });
  }
});

router.delete('/adicionais/:id', async (req, res) => {
  const { id } = req.params;
  const idNum = parseInt(id);

  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ error: 'ID inválido para exclusão.' });
  }

  try {
    await pool.query('DELETE FROM adicionais WHERE id = $1', [idNum]);
    return res.json({ message: 'Adicional excluído com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir adicional:', err);
    return res.status(500).json({ error: 'Erro ao excluir adicional.' });
  }
});

// ROTAS: Clientes

router.post('/clientes', async (req, res) => {
  const { cpf, nome, telefone, endereco } = req.body;

  if (!cpf || !nome || !telefone || !endereco) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: CPF, nome, telefone e endereço.' });
  }

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
      [cpf, nome, telefone, endereco]
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

  if (endereco) {
    campos.push(`endereco = $${valores.length + 1}`);
    valores.push(endereco);
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