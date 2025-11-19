"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Botão "Mais Vendidos" e área de resultado
const btnMaisVendidos = document.getElementById("maisvendidos");
const ListaVendasDiv = document.getElementById("listaVendas");
// Variáveis globais para armazenar resultados
let vendasProduto = []; // lista de vendas detalhadas
let maisVendidoProduto = null; // resumo do mais vendido
let maisVendidoPedidos = []; // lista de pedidos do mais vendido
// -----------------------------
// Evento do botão "Mais Vendidos"
// -----------------------------
btnMaisVendidos.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    // Limpa resultados anteriores
    ListaVendasDiv.innerHTML = "";
    btnLimparRelatorio.style.display = "none";
    btnExportarTxt.style.display = "none";
    // Reseta variáveis globais
    vendasProduto = [];
    maisVendidoProduto = null;
    maisVendidoPedidos = [];
    // Captura valores dos filtros
    const tipo = produtoSelect.value;
    const dataInicio = dataInicioProd.value;
    const dataFim = dataFimProd.value;
    // Validação dos campos
    if (!tipo || tipo === "Selecione um produto" || !dataInicio || !dataFim) {
        ListaVendasDiv.innerHTML = `<p class="text-danger">Preencha todos os campos para consultar.</p>`;
        return;
    }
    // Monta query string
    const params = new URLSearchParams({ tipo, dataInicio, dataFim });
    try {
        // Faz requisição GET para a rota /mais-vendido
        const res = yield fetch(`http://localhost:3000/mais-vendido?${params.toString()}`);
        if (!res.ok)
            throw new Error("Erro ao buscar histórico de vendas");
        const data = yield res.json();
        // Caso a API retorne erro
        if (data.error) {
            ListaVendasDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
            return;
        }
        // Salva resultado
        maisVendidoProduto = data.maisVendido;
        maisVendidoPedidos = data.pedidos || [];
        // Se encontrou produto mais vendido
        if (maisVendidoProduto) {
            // Formata datas
            const primeiraData = new Date(maisVendidoProduto.primeira_venda).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
            });
            const ultimaData = new Date(maisVendidoProduto.ultima_venda).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
            });
            // Exibe resumo na tela
            ListaVendasDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>${maisVendidoProduto.produto}</strong> foi o mais vendido em ${maisVendidoProduto.pedidos} pedido(s),
          totalizando ${maisVendidoProduto.total_unidades} unidade(s).
        </div>
        <p class="mt-2">Primeira venda: ${primeiraData} • Última venda: ${ultimaData}</p>
      `;
            // Mostra botões de limpar e exportar
            btnLimparRelatorio.style.display = "inline-block";
            btnExportarTxt.style.display = "block";
        }
    }
    catch (err) {
        console.error("Erro ao consultar produto:", err);
        ListaVendasDiv.innerHTML = `<p class="text-danger">Erro ao consultar produto.</p>`;
    }
}));
//# sourceMappingURL=maisvend.js.map