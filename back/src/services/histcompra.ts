// Referências aos elementos do DOM
const btnBuscarCompras = document.getElementById("btnBuscarCompras") as HTMLButtonElement;
const cpfInput = document.getElementById("cpfClienteH") as HTMLInputElement;
const dataInicioInput = document.getElementById("dataInicioCliente") as HTMLInputElement;
const dataFimInput = document.getElementById("dataFimCliente") as HTMLInputElement;
const resultadoDiv = document.getElementById("resultadoCompras") as HTMLDivElement;
const btnLimparTudo = document.getElementById("btnLimparTudo") as HTMLButtonElement;
const limparContainer = document.getElementById("limparContainer") as HTMLDivElement;

// Inputs de cliente
const cpfCliente = document.getElementById("CpfCliente") as HTMLInputElement;
const nomeCliente = document.getElementById("NomeCliente") as HTMLInputElement;
const telefoneClient = document.getElementById("TelefoneCliente") as HTMLInputElement;
const enderecoCliente = document.getElementById("EnderecoCliente") as HTMLInputElement;
const senhaCliente = document.getElementById("SenhaCliente") as HTMLInputElement;

const btnAtualizar = document.getElementById("alterac") as HTMLButtonElement;

// Variável para armazenar histórico atual (usada na exportação)
let historicoAtual: any[] = [];

// -----------------------------
// Atualizar cliente
// -----------------------------

btnAtualizar.addEventListener("click", () => {
  const cpf = cpfCliente.value.trim();
  const senha = senhaCliente.value.trim();

  // CPF e senha são obrigatórios para permitir qualquer atualização
  if (!cpf) {
    alert("Informe o CPF do cliente para atualizar.");
    return;
  }
  if (!senha) {
    alert("Informe a senha do cliente para atualizar.");
    return;
  }

  // Captura dados preenchidos (campos que realmente serão atualizados)
  const nome = nomeCliente.value.trim();
  const telefone = telefoneClient.value.trim();
  const endereco = enderecoCliente.value.trim();

  // Monta objeto apenas com os campos que serão alterados
  const clienteUpdate: any = {};
  if (nome) clienteUpdate.nome = nome;
  if (telefone) clienteUpdate.telefone = telefone;
  if (endereco) clienteUpdate.endereco = endereco;

  // Se não houver nenhum campo para atualizar, avisa o usuário
  if (Object.keys(clienteUpdate).length === 0) {
    alert("Preencha ao menos um campo (nome, telefone ou endereço) para atualizar.");
    return;
  }

  // Requisição PUT para atualizar cliente
  // Envia a senha como cabeçalho de autenticação (não como campo de atualização)
  fetch(`http://localhost:3000/clientes/${cpf}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Client-Senha": senha
    },
    body: JSON.stringify(clienteUpdate),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      // Limpa campos após atualização
      cpfCliente.value = "";
      nomeCliente.value = "";
      telefoneClient.value = "";
      enderecoCliente.value = "";
      senhaCliente.value = "";
    })
    .catch(err => {
      console.error("Erro ao atualizar cliente:", err);
      alert("Erro ao atualizar cliente.");
    });
});

// -----------------------------
// Buscar histórico de compras
// -----------------------------
btnBuscarCompras.addEventListener("click", () => {
  resultadoDiv.innerHTML = "";
  historicoAtual = []; // limpa histórico anterior

  const cpf = cpfInput.value.trim();
  const dataInicio = dataInicioInput.value;
  const dataFim = dataFimInput.value;

  // Validação
  if (!cpf || !dataInicio || !dataFim) {
    resultadoDiv.innerHTML = `<p class="text-danger">Preencha todos os campos para buscar o histórico.</p>`;
    return;
  }

  const params = new URLSearchParams({ cpf, dataInicio, dataFim });

  // Requisição GET para histórico de compras
  fetch(`http://localhost:3000/historico-compras?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultadoDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
      } else {
        historicoAtual = data.pedidos; // salva para exportação

        // Monta lista de pedidos
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
      limparContainer.style.display = "flex"; // mostra botão de limpar
    })
    .catch(err => {
      console.error("Erro ao buscar histórico:", err);
      resultadoDiv.innerHTML = `<p class="text-danger">Erro ao buscar histórico de compras.</p>`;
    });
});

// -----------------------------
// Exportar histórico em TXT
// -----------------------------
document.getElementById("btnExportarTxt")?.addEventListener("click", () => {
  if (historicoAtual.length === 0) {
    alert("Nenhum histórico carregado para exportar.");
    return;
  }

  // Monta linhas de texto
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

  // Cria arquivo TXT e dispara download
  const blob = new Blob([linhas.join("\n\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "historico_compras.txt";
  a.click();

  URL.revokeObjectURL(url);
});

// -----------------------------
// Limpar todos os campos
// -----------------------------
btnLimparTudo.addEventListener("click", () => {
  // Limpa inputs de cliente e histórico
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

  // Oculta botão de limpar
  limparContainer.style.display = "none";

  alert("Todos os campos foram limpos!");
});
