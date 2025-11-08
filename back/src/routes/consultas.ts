import express from 'express';
import { pool } from '../data/db.js';

const routercons = express.Router();

// Consulta Produtos

routercons.get("/produto", async (req, res) => {
  const { tipo, id } = req.query;

  if (!tipo || !id) {
    return res.status(400).json({ error: "Parâmetros inválidos." });
  }

  const tabela = {
    pizza: "pizzas",
    bebida: "bebidas",
    sobremesa: "sobremesas",
    adicional: "adicionais"
  }[tipo as string];

  if (!tabela) {
    return res.status(400).json({ error: "Tipo inválido." });
  }

  try {
    const result = await pool.query(`SELECT * FROM ${tabela} WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado." });
    }

    return res.json({ produto: result.rows[0] });
  } catch (err) {
    console.error("Erro ao consultar produto:", err);
    return res.status(500).json({ error: "Erro ao consultar produto." });
  }
});

// Consultar Clientes

routercons.get("/clientes", async (req, res) => {
  const { id, cpf, nome } = req.query;

  let query = "SELECT * FROM clientes";
  const conditions: string[] = [];
  const values: any[] = [];

  if (id) {
    conditions.push("id = $1");
    values.push(id);
  }

  if (cpf) {
    conditions.push(`cpf = $${values.length + 1}`);
    values.push(cpf);
  }

  if (nome) {
    conditions.push(`LOWER(nome) LIKE LOWER($${values.length + 1})`);
    values.push(`%${nome}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    return res.json({ clientes: result.rows });
  } catch (err) {
    console.error("Erro ao consultar cliente:", err);
    return res.status(500).json({ error: "Erro ao consultar cliente." });
  }
});

export default routercons;