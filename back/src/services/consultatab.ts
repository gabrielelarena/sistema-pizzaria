const idClienteInput = document.getElementById("idcliente") as HTMLInputElement;
const cpfClienteConsulta = document.getElementById("CpfCliente") as HTMLInputElement;
const nomeClienteConsulta = document.getElementById("NomeCliente") as HTMLInputElement;
const resultadoClienteDiv = document.getElementById("resultadoCliente") as HTMLDivElement;
const btnConsultaCliente = document.getElementById("consultacliente") as HTMLButtonElement;

const btnBuscarCompras = document.getElementById("btnBuscarCompras") as HTMLButtonElement;
const cpfInput = document.getElementById("cpfClienteH") as HTMLInputElement;
const dataInicioInput = document.getElementById("dataInicioCliente") as HTMLInputElement;
const dataFimInput = document.getElementById("dataFimCliente") as HTMLInputElement;
const resultadoDiv = document.getElementById("resultadoCompras") as HTMLDivElement;
const btnLimparTudo = document.getElementById("btnLimparTudo") as HTMLButtonElement;
const limparContainer = document.getElementById("limparContainer") as HTMLDivElement;


function consultarProduto(tipo: string, id: string) {
  if (!id || isNaN(parseInt(id))) {
    alert("Informe um ID válido.");
    return;
  }

  fetch(`http://localhost:3000/produto?tipo=${tipo}&id=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        const p = data.produto;
        alert(`Produto encontrado:\nNome: ${p.nome}\nPreço: R$ ${p.preco}${p.tamanho ? `\nTamanho: ${p.tamanho}` : ""}`);
      }
    })
    .catch(err => {
      console.error("Erro ao consultar produto:", err);
      alert("Erro ao consultar produto.");
    });
}

document.getElementById("consultapizza")?.addEventListener("click", () => {
  const id = (document.getElementById("idPizza") as HTMLInputElement).value.trim();
  consultarProduto("pizza", id);
});

document.getElementById("consultabebida")?.addEventListener("click", () => {
  const id = (document.getElementById("idBebida") as HTMLInputElement).value.trim();
  consultarProduto("bebida", id);
});

document.getElementById("consultasobremesa")?.addEventListener("click", () => {
  const id = (document.getElementById("idSobremesa") as HTMLInputElement).value.trim();
  consultarProduto("sobremesa", id);
});

document.getElementById("consultaadicional")?.addEventListener("click", () => {
  const id = (document.getElementById("idAdicional") as HTMLInputElement).value.trim();
  consultarProduto("adicional", id);
});

let historicoAtual: any[] = [];

btnBuscarCompras.addEventListener("click", () => {
  resultadoDiv.innerHTML = "";
  historicoAtual = []; // limpa antes de buscar

  const cpf = cpfInput.value.trim();
  const dataInicio = dataInicioInput.value;
  const dataFim = dataFimInput.value;

  if (!cpf || !dataInicio || !dataFim) {
    resultadoDiv.innerHTML = `<p class="text-danger">Preencha todos os campos para buscar o histórico.</p>`;
    return;
  }

  const params = new URLSearchParams({ cpf, dataInicio, dataFim });

  fetch(`http://localhost:3000/historico-compras?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultadoDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
      } else {
        historicoAtual = data.pedidos; // salva para exportação

        const lista = data.pedidos.map((p: any) => `
          <div class="border rounded p-3 mb-3 bg-light">
            <h6><strong>Data:</strong> ${new Date(p.data_pedido).toLocaleString()}</h6>
            <ul style="list-style: none; padding-left: 0;">
              ${p.pizza ? `<li><strong>Pizza:</strong> ${p.pizza} (${p.tamanho}) x${p.quantidade_pizza}</li>` : ""}
              ${p.bebida ? `<li><strong>Bebida:</strong> ${p.bebida} x${p.quantidade_bebida}</li>` : ""}
              ${p.sobremesa ? `<li><strong>Sobremesa:</strong> ${p.sobremesa} x${p.quantidade_sobremesa}</li>` : ""}
              ${p.adicional ? `<li><strong>Adicional:</strong> ${p.adicional} x${p.quantidade_adicional}</li>` : ""}
              <li><strong>Pagamento:</strong> ${p.forma_pagamento}</li>
              <li><strong>Total:</strong> R$ ${Number(p.preco_total || 0).toFixed(2)}</li>
              ${p.observacoes ? `<li><strong>Obs:</strong> ${p.observacoes}</li>` : ""}
            </ul>
          </div>
        `).join("");

        resultadoDiv.innerHTML = `<h5 class="mb-3">Histórico de Compras:</h5>${lista}`;
      }
      limparContainer.style.display = "flex"; // mostra o botão
    })
    .catch(err => {
      console.error("Erro ao buscar histórico:", err);
      resultadoDiv.innerHTML = `<p class="text-danger">Erro ao buscar histórico de compras.</p>`;
    });
});

document.getElementById("btnExportarTxt")?.addEventListener("click", () => {
  if (historicoAtual.length === 0) {
    alert("Nenhum histórico carregado para exportar.");
    return;
  }

  const linhas = historicoAtual.map((p: any, i: number) => {
    return [
      `Pedido ${i + 1}`,
      `Data: ${new Date(p.data_pedido).toLocaleString()}`,
      p.pizza ? `Pizza: ${p.pizza} (${p.tamanho}) x${p.quantidade_pizza}` : "",
      p.bebida ? `Bebida: ${p.bebida} x${p.quantidade_bebida}` : "",
      p.sobremesa ? `Sobremesa: ${p.sobremesa} x${p.quantidade_sobremesa}` : "",
      p.adicional ? `Adicional: ${p.adicional} x${p.quantidade_adicional}` : "",
      `Pagamento: ${p.forma_pagamento}`,
      `Total: R$ ${Number(p.preco_total || 0).toFixed(2)}`,
      p.observacoes ? `Observações: ${p.observacoes}` : "",
      "-----------------------------"
    ].filter(Boolean).join("\n");
  });

  const blob = new Blob([linhas.join("\n\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "historico_compras.txt";
  a.click();

  URL.revokeObjectURL(url);
});

btnLimparTudo.addEventListener("click", () => {
  // Limpa inputs
  cpfInput.value = "";
  dataInicioInput.value = "";
  dataFimInput.value = "";

  // Limpa resultados
  resultadoDiv.innerHTML = "";

  // Limpa campos de produto
  ["idPizza", "idBebida", "idSobremesa", "idAdicional"].forEach(id => {
    const campo = document.getElementById(id) as HTMLInputElement;
    if (campo) campo.value = "";
  });

  // Oculta o botão
  limparContainer.style.display = "none";

  alert("Todos os campos foram limpos!");
});


btnConsultaCliente.addEventListener("click", () => {
  resultadoClienteDiv.innerHTML = "";

  const id = idClienteInput.value.trim();
  const cpf = cpfClienteConsulta.value.trim();
  const nome = nomeClienteConsulta.value.trim();

  if (!id && !cpf && !nome) {
    resultadoClienteDiv.innerHTML = `<p class="text-danger">Preencha ao menos um campo para consultar.</p>`;
    return;
  }

  const params = new URLSearchParams();
  if (id) params.append("id", id);
  if (cpf) params.append("cpf", cpf);
  if (nome) params.append("nome", nome);

  fetch(`http://localhost:3000/clientes?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultadoClienteDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
      } else {
        const lista = data.clientes.map((c: any) => `
          <div class="mb-3">
            <h5 class="text-success">Cliente #${c.id}</h5>
            <ul>
              <li><strong>Nome:</strong> ${c.nome}</li>
              <li><strong>CPF:</strong> ${c.cpf}</li>
              <li><strong>Endereço:</strong> ${c.endereco || "Não informado"}</li>
              <li><strong>Telefone:</strong> ${c.telefone || "Não informado"}</li>
            </ul>
          </div>
        `).join("");

        resultadoClienteDiv.innerHTML = lista;
      }
    })
    .catch(err => {
      console.error("Erro ao consultar cliente:", err);
      resultadoClienteDiv.innerHTML = `<p class="text-danger">Erro ao consultar cliente.</p>`;
    });
});