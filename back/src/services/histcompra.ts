const btnBuscarCompras = document.getElementById("btnBuscarCompras") as HTMLButtonElement;
const cpfInput = document.getElementById("cpfClienteH") as HTMLInputElement;
const dataInicioInput = document.getElementById("dataInicioCliente") as HTMLInputElement;
const dataFimInput = document.getElementById("dataFimCliente") as HTMLInputElement;
const resultadoDiv = document.getElementById("resultadoCompras") as HTMLDivElement;
const btnLimparTudo = document.getElementById("btnLimparTudo") as HTMLButtonElement;
const limparContainer = document.getElementById("limparContainer") as HTMLDivElement;
const cpfCliente = document.getElementById("CpfCliente") as HTMLInputElement;
const nomeCliente = document.getElementById("NomeCliente") as HTMLInputElement;
const telefoneClient = document.getElementById("TelefoneCliente") as HTMLInputElement;
const enderecoCliente = document.getElementById("EnderecoCliente") as HTMLInputElement;
const senhaCliente = document.getElementById("SenhaCliente") as HTMLInputElement;

const btnAtualizar = document.getElementById("alterac") as HTMLButtonElement;

let historicoAtual: any[] = [];

btnAtualizar.addEventListener("click", () => {
  const cpf = cpfCliente.value.trim();
  if (!cpf) {
    alert("Informe o CPF do cliente para atualizar.");
    return;
  }

  const nome = nomeCliente.value.trim();
  const telefone = telefoneClient.value.trim();
  const endereco = enderecoCliente.value.trim();
  const senha = senhaCliente.value.trim();

  const cliente: any = {};
  if (nome) cliente.nome = nome;
  if (telefone) cliente.telefone = telefone;
  if (endereco) cliente.endereco = endereco;
  if (senha) cliente.senha = senha;

  if (Object.keys(cliente).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/clientes/${cpf}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      // opcional: limpar campos
      cpfClienteInput.value = "";
      nomeClienteInput.value = "";
      telefoneClienteInput.value = "";
      enderecoClienteInput.value = "";
      senhaClienteInput.value = "";
    })
    .catch(err => {
      console.error("Erro ao atualizar cliente:", err);
      alert("Erro ao atualizar cliente.");
    });
});

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
  cpfCliente.value = "";
  nomeCliente.value = "";
  enderecoCliente.value = "";
  telefoneClient.value = "";
  senhaCliente.value = "";

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
