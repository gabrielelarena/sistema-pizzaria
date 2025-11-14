const btnMaisVendidos = document.getElementById("maisvendidos") as HTMLButtonElement;
const ListaVendasDiv = document.getElementById("listaVendas") as HTMLDivElement;

// Variáveis globais
let vendasProduto: any[] = [];
let maisVendidoProduto: {
  produto: string;
  total_unidades: number;
  pedidos: number;
  primeira_venda: string;
  ultima_venda: string;
} | null = null;
let maisVendidoPedidos: any[] = [];

// Botão "Mais Vendidos"
btnMaisVendidos.addEventListener("click", async () => {
  ListaVendasDiv.innerHTML = "";
  btnLimparRelatorio.style.display = "none";
  btnExportarTxt.style.display = "none";

  vendasProduto = [];
  maisVendidoProduto = null;
  maisVendidoPedidos = [];

  const tipo = produtoSelect.value;
  const dataInicio = dataInicioProd.value;
  const dataFim = dataFimProd.value;

  if (!tipo || tipo === "Selecione um produto" || !dataInicio || !dataFim) {
    ListaVendasDiv.innerHTML = `<p class="text-danger">Preencha todos os campos para consultar.</p>`;
    return;
  }

  const params = new URLSearchParams({ tipo, dataInicio, dataFim });

  try {
    const res = await fetch(`http://localhost:3000/mais-vendido?${params.toString()}`);
    if (!res.ok) throw new Error("Erro ao buscar histórico de vendas");

    const data = await res.json();
    if (data.error) {
      ListaVendasDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
      return;
    }

    maisVendidoProduto = data.maisVendido;
    maisVendidoPedidos = data.pedidos || [];

    if (maisVendidoProduto) {
      const primeiraData = new Date(maisVendidoProduto.primeira_venda).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
      });
      const ultimaData = new Date(maisVendidoProduto.ultima_venda).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
      });

      ListaVendasDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>${maisVendidoProduto.produto}</strong> foi o mais vendido em ${maisVendidoProduto.pedidos} pedido(s),
          totalizando ${maisVendidoProduto.total_unidades} unidade(s).
        </div>
        <p class="mt-2">Primeira venda: ${primeiraData} • Última venda: ${ultimaData}</p>
      `;

      btnLimparRelatorio.style.display = "inline-block";
      btnExportarTxt.style.display = "block";
    }
  } catch (err) {
    console.error("Erro ao consultar produto:", err);
    ListaVendasDiv.innerHTML = `<p class="text-danger">Erro ao consultar produto.</p>`;
  }
});
