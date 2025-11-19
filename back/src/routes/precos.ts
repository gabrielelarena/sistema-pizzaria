import { Router } from "express";
import { pool } from '../data/db.js';

const routerpreco = Router(); // Cria um roteador do Express para organizar rotas relacionadas a preço

// -----------------------------
// Rota POST para calcular preço do pedido
// -----------------------------
routerpreco.post("/calcular-preco", async (req, res) => {
  const pedido = req.body; // Recebe os dados do pedido enviados no corpo da requisição

  try {
    let total = 0; // Variável acumuladora do preço total

    // -----------------------------
    // Pizza
    // -----------------------------
    if (pedido.pizza && pedido.tamanho && pedido.quantidade_pizza > 0) {
      // Consulta o preço da pizza no banco, filtrando por nome e tamanho
      const r = await pool.query(
        "SELECT preco FROM pizzas WHERE nome = $1 AND tamanho = $2",
        [pedido.pizza, pedido.tamanho]
      );
      if (r.rows.length > 0) {
        // Multiplica o preço unitário pela quantidade
        total += r.rows[0].preco * pedido.quantidade_pizza;
      }
    }

    // -----------------------------
    // Bebida
    // -----------------------------
    if (pedido.bebida && pedido.quantidade_bebida > 0) {
      // Consulta o preço da bebida no banco
      const r = await pool.query("SELECT preco FROM bebidas WHERE nome = $1", [pedido.bebida]);
      if (r.rows.length > 0) {
        total += r.rows[0].preco * pedido.quantidade_bebida;
      }
    }

    // -----------------------------
    // Sobremesa
    // -----------------------------
    if (pedido.sobremesa && pedido.quantidade_sobremesa > 0) {
      // Consulta o preço da sobremesa no banco
      const r = await pool.query("SELECT preco FROM sobremesas WHERE nome = $1", [pedido.sobremesa]);
      if (r.rows.length > 0) {
        total += r.rows[0].preco * pedido.quantidade_sobremesa;
      }
    }

    // -----------------------------
    // Adicional
    // -----------------------------
    if (pedido.adicional && pedido.quantidade_adicional > 0) {
      // Consulta o preço do adicional no banco
      const r = await pool.query("SELECT preco FROM adicionais WHERE nome = $1", [pedido.adicional]);
      if (r.rows.length > 0) {
        total += r.rows[0].preco * pedido.quantidade_adicional;
      }
    }

    // Retorna o preço total calculado
    res.json({ preco_total: total });
  } catch (err) {
    // Caso ocorra algum erro na consulta ou cálculo
    console.error("Erro ao calcular preço:", err);
    res.status(500).json({ error: "Erro ao calcular preço." });
  }
});

export default routerpreco; // Exporta o roteador para ser usado no servidor principal
