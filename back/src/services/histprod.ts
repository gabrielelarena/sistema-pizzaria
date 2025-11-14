
const btnProcurarProd = document.getElementById("procurarprod") as HTMLButtonElement;
const produtoSelect = document.getElementById("produtoesc") as HTMLSelectElement;
const nomeProdutoInput = document.getElementById("NomeProduto") as HTMLInputElement;
const dataInicioProd = document.getElementById("DataInicio") as HTMLInputElement;
const dataFimProd = document.getElementById("DataFim") as HTMLInputElement;
const listaVendasDiv = document.getElementById("lista-vendas") as HTMLDivElement;
const btnLimparRelatorio = document.getElementById("limparRelatorio") as HTMLButtonElement;
const btnExportarTxt = document.getElementById("exportarTxt") as HTMLButtonElement;


btnProcurarProd.addEventListener("click", () => {
    listaVendasDiv.innerHTML = "";
    btnLimparRelatorio.style.display = "none";
    btnExportarTxt.style.display = "none";

    const tipo = produtoSelect.value;
    const nome = nomeProdutoInput.value.trim();
    const dataInicio = dataInicioProd.value;
    const dataFim = dataFimProd.value;

    if (!tipo || tipo === "Selecione um produto" || !nome || !dataInicio || !dataFim) {
        listaVendasDiv.innerHTML = `<p class="text-danger">Preencha todos os campos para consultar.</p>`;
        return;
    }

    const params = new URLSearchParams({ tipo, nome, dataInicio, dataFim });

    fetch(`http://localhost:3000/historico-produto?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                listaVendasDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
                return;
            }

            vendasProduto = data.vendas;

            const resumo = vendasProduto.map(v => {
                const dataFormatada = new Date(v.data_pedido).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long"
                });
                return `${v.quantidade} ${data.produto} - ${dataFormatada}`;
            });

            listaVendasDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>${data.produto}</strong> vendido em ${vendasProduto.length} pedido(s).
        </div>
        <ul class="list-group mt-2">
          ${resumo.map(item => `<li class="list-group-item">${item}</li>`).join("")}
        </ul>
      `;

            btnLimparRelatorio.style.display = "inline-block";
            btnExportarTxt.style.display = "block";
        })
        .catch(err => {
            console.error("Erro ao consultar produto:", err);
            listaVendasDiv.innerHTML = `<p class="text-danger">Erro ao consultar produto.</p>`;
        });
});

// Botão "Limpar Relatório"
btnLimparRelatorio.addEventListener("click", () => {
  produtoSelect.value = "Selecione um produto";
  nomeProdutoInput.value = "";
  dataInicioProd.value = "";
  dataFimProd.value = "";
  listaVendasDiv.innerHTML = "";
  btnLimparRelatorio.style.display = "none";
  btnExportarTxt.style.display = "none";
  ListaVendasDiv.innerHTML = "";

  vendasProduto = [];
  maisVendidoProduto = null;
  maisVendidoPedidos = [];
});

// Botão "Exportar TXT"
btnExportarTxt.addEventListener("click", () => {
  let conteudo = "";

  // Caso 1: relatório detalhado
  if (vendasProduto && vendasProduto.length > 0) {
    const nome = nomeProdutoInput.value.trim();
    const tipoSelecionado = produtoSelect.options[produtoSelect.selectedIndex]?.text || "Produto";

    const linhas = vendasProduto.map(v => {
      const dataObj = new Date(v.data_pedido);
      const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long"
      });
      const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      return `${v.quantidade} ${nome} - ${dataFormatada} às ${horaFormatada}`;
    });

    conteudo = [
      "------ Relatório de Vendas ---------",
      `Produto: ${nome}`,
      `Tipo: ${tipoSelecionado}`,
      "",
      ...linhas
    ].join("\n");
  }

  // Caso 2: relatório do mais vendido
  else if (maisVendidoProduto) {
    const tipoSelecionado = produtoSelect.options[produtoSelect.selectedIndex]?.text || "Categoria";

    const primeiraData = new Date(maisVendidoProduto.primeira_venda).toLocaleDateString("pt-BR");
    const ultimaData = new Date(maisVendidoProduto.ultima_venda).toLocaleDateString("pt-BR");

    const linhas = maisVendidoPedidos.map(p => {
      const dataObj = new Date(p.data_pedido);
      const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long"
      });
      const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      return `${p.quantidade} unidade(s) - ${dataFormatada} às ${horaFormatada}`;
    });

    conteudo = [
      "------ Relatório do Mais Vendido ---------",
      `Categoria: ${tipoSelecionado}`,
      `Produto: ${maisVendidoProduto.produto}`,
      `Total de unidades: ${maisVendidoProduto.total_unidades}`,
      `Pedidos: ${maisVendidoProduto.pedidos}`,
      `Primeira venda: ${primeiraData}`,
      `Última venda: ${ultimaData}`,
      "",
      "------ Pedidos detalhados ---------",
      ...linhas
    ].join("\n");
  }

  else {
    alert("Nenhum relatório para exportar.");
    return;
  }

  const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "relatorio_vendas.txt";
  a.click();
  URL.revokeObjectURL(url);
});