// Botão "Mais Vendidos" e área de resultado
const btnMaisVendidos = document.getElementById("maisvendidos") as HTMLButtonElement;
const ListaVendasDiv = document.getElementById("listaVendas") as HTMLDivElement;

// Variáveis globais para armazenar resultados
let vendasProduto: any[] = []; // lista de vendas detalhadas
let maisVendidoProduto: {
  produto: string;
  total_unidades: number;
  pedidos: number;
  primeira_venda: string;
  ultima_venda: string;
} | null = null; // resumo do mais vendido
let maisVendidoPedidos: any[] = []; // lista de pedidos do mais vendido

// -----------------------------
// Evento do botão "Mais Vendidos"
// -----------------------------
btnMaisVendidos.addEventListener("click", async () => {
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
    const res = await fetch(`http://localhost:3000/mais-vendido?${params.toString()}`);
    if (!res.ok) throw new Error("Erro ao buscar histórico de vendas");

    const data = await res.json();

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
  } catch (err) {
    console.error("Erro ao consultar produto:", err);
    ListaVendasDiv.innerHTML = `<p class="text-danger">Erro ao consultar produto.</p>`;
  }
});
