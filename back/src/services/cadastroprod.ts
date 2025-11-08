const nomeInput = document.getElementById("nomePizza") as HTMLInputElement;
const precoInput = document.getElementById("precoPizza") as HTMLInputElement;
const tamanhoSelect = document.getElementById("tamanhoPizza") as HTMLSelectElement;
const idInput = document.getElementById("idPizza") as HTMLInputElement;
const nomeBebidaInput = document.getElementById("nomeBebida") as HTMLInputElement;
const precoBebidaInput = document.getElementById("precoBebida") as HTMLInputElement;
const idBebidaInput = document.getElementById("idBebida") as HTMLInputElement;
const nomeSobremesaInput = document.getElementById("nomeSobremesa") as HTMLInputElement;
const precoSobremesaInput = document.getElementById("precoSobremesa") as HTMLInputElement;
const idSobremesaInput = document.getElementById("idSobremesa") as HTMLInputElement;
const nomeAdicionalInput = document.getElementById("nomeAdicional") as HTMLInputElement;
const precoAdicionalInput = document.getElementById("precoAdicional") as HTMLInputElement;
const idAdicionalInput = document.getElementById("idAdicional") as HTMLInputElement;
const cpfClienteInput = document.getElementById("CpfCliente") as HTMLInputElement;
const nomeClienteInput = document.getElementById("NomeCliente") as HTMLInputElement;
const telefoneClienteInput = document.getElementById("TelefoneCliente") as HTMLInputElement;
const enderecoClienteInput = document.getElementById("EnderecoCliente") as HTMLInputElement;
const produtoEsc = document.getElementById("produtoesc") as HTMLSelectElement;
const NomeProduto = document.getElementById("NomeProduto") as HTMLInputElement;
const DataInicio = document.getElementById("DataInicio") as HTMLInputElement;
const DataFim = document.getElementById("DataFim") as HTMLInputElement;
const produtoDiv = document.getElementById("produtodevs") as HTMLDivElement;
const listaVendas = document.getElementById("lista-vendas") as HTMLDivElement;
const resultadoCompras = document.getElementById("resultadoCompras") as HTMLDivElement;

const limparRelatorioBtn = document.getElementById("limparRelatorio") as HTMLButtonElement;
const btnBuscarCompras = document.getElementById("btnBuscarCompras") as HTMLButtonElement;
const btnCadastrarB = document.getElementById("cadastrabebida") as HTMLButtonElement;
const btnAtualizarB = document.getElementById("alterabebida") as HTMLButtonElement;
const btnExcluirB = document.getElementById("excluibebida") as HTMLButtonElement;
const btnCadastrarP = document.getElementById("cadastrapizza") as HTMLButtonElement;
const btnAtualizarP = document.getElementById("alterapizza") as HTMLButtonElement;
const btnExcluirP = document.getElementById("excluipizza") as HTMLButtonElement;
const btnExcluirS = document.getElementById("excluisobremesa") as HTMLButtonElement;
const btnCadastrarS = document.getElementById("cadastrasobremesa") as HTMLButtonElement;
const btnAtualizarS = document.getElementById("alterasobremesa") as HTMLButtonElement;
const btnCadastrarA = document.getElementById("cadastraadicional") as HTMLButtonElement;
const btnAtualizarA = document.getElementById("alteraadicional") as HTMLButtonElement;
const btnExcluirA = document.getElementById("excluiadicional") as HTMLButtonElement;
const btnCadastrarC = document.getElementById("cadastracliente") as HTMLButtonElement;
const btnAtualizarC = document.getElementById("alteracliente") as HTMLButtonElement;
const btnExcluirC = document.getElementById("excluicliente") as HTMLButtonElement;
const btnProcurarProd = document.getElementById("procurarprod") as HTMLButtonElement; //

// Utilitário para converter preço corretamente
function parsePreco(valor: string): number {
  const normalizado = valor.replace(',', '.');
  const preco = parseFloat(normalizado);
  return isNaN(preco) ? 0 : preco;
}

// Limpar campos do formulário
function limparCampos() {
  nomeInput.value = "";
  precoInput.value = "";
  tamanhoSelect.selectedIndex = 0;
  idInput.value = "";
  idBebidaInput.value = "";
  nomeBebidaInput.value = "";
  precoBebidaInput.value = "";
  nomeSobremesaInput.value = "";
  precoSobremesaInput.value = "";
  idSobremesaInput.value = "";
  nomeAdicionalInput.value = "";
  precoAdicionalInput.value = "";
  idAdicionalInput.value = "";
  cpfClienteInput.value = "";
  nomeClienteInput.value = "";
  telefoneClienteInput.value = "";
  enderecoClienteInput.value = "";

}

// Cadastrar pizza
btnCadastrarP.addEventListener("click", () => {
  const nome = nomeInput.value.trim();
  const tamanho = tamanhoSelect.options[tamanhoSelect.selectedIndex]?.text ?? "";
  const preco = parsePreco(precoInput.value);
  const pizza = { nome, tamanho, preco };

  fetch("http://localhost:3000/pizzas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pizza),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar pizza.");
    });
});

// Atualizar pizza
btnAtualizarP.addEventListener("click", () => {
  const id = parseInt(idInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para atualizar.");
    return;
  }

  const nome = nomeInput.value.trim();
  const tamanho = tamanhoSelect.options[tamanhoSelect.selectedIndex]?.text ?? "";
  const preco = parsePreco(precoInput.value);

  const pizza: any = {};
  if (nome) pizza.nome = nome;
  if (tamanho && tamanho !== "Selecione um tamanho:") pizza.tamanho = tamanho;
  if (preco > 0) pizza.preco = preco;

  if (Object.keys(pizza).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/pizzas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pizza),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar pizza.");
    });
});

// Excluir pizza
btnExcluirP.addEventListener("click", () => {
  const id = parseInt(idInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para excluir.");
    return;
  }

  fetch(`http://localhost:3000/pizzas/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir pizza.");
    });
});

// Cadastrar bebida
btnCadastrarB.addEventListener("click", () => {
  const nome = nomeBebidaInput.value.trim();
  const preco = parsePreco(precoBebidaInput.value);

  if (!nome || preco <= 0) {
    alert("Preencha o nome e um preço válido.");
    return;
  }

  const bebida = { nome, preco };

  fetch("http://localhost:3000/bebidas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bebida),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar bebida:", err);
      alert("Erro ao cadastrar bebida.");
    });
});

// Atualizar bebida
btnAtualizarB.addEventListener("click", () => {
  const id = parseInt(idBebidaInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para atualizar.");
    return;
  }

  const nome = nomeBebidaInput.value.trim();
  const preco = parsePreco(precoBebidaInput.value);

  const bebida: any = {};
  if (nome) bebida.nome = nome;
  if (preco > 0) bebida.preco = preco;

  if (Object.keys(bebida).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/bebidas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bebida),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar bebida:", err);
      alert("Erro ao atualizar bebida.");
    });
});

// Excluir bebida
btnExcluirB.addEventListener("click", () => {
  const id = parseInt(idBebidaInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para excluir.");
    return;
  }

  fetch(`http://localhost:3000/bebidas/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir bebida:", err);
      alert("Erro ao excluir bebida.");
    });
});

// Cadastrar sobremesa
btnCadastrarS.addEventListener("click", () => {
  const nome = nomeSobremesaInput.value.trim();
  const preco = parsePreco(precoSobremesaInput.value);

  if (!nome || preco <= 0) {
    alert("Preencha o nome e um preço válido.");
    return;
  }

  const sobremesa = { nome, preco };

  fetch("http://localhost:3000/sobremesas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sobremesa),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar sobremesa:", err);
      alert("Erro ao cadastrar sobremesa.");
    });
});


// Atualizar sobremesa
btnAtualizarS.addEventListener("click", () => {
  const id = parseInt(idSobremesaInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para atualizar.");
    return;
  }

  const nome = nomeSobremesaInput.value.trim();
  const preco = parsePreco(precoSobremesaInput.value);

  const sobremesa: any = {};
  if (nome) sobremesa.nome = nome;
  if (preco > 0) sobremesa.preco = preco;

  if (Object.keys(sobremesa).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/sobremesas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sobremesa),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar sobremesa:", err);
      alert("Erro ao atualizar sobremesa.");
    });
});

// Excluir sobremesa
btnExcluirS.addEventListener("click", () => {
  const id = parseInt(idSobremesaInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para excluir.");
    return;
  }

  fetch(`http://localhost:3000/sobremesas/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir sobremesa:", err);
      alert("Erro ao excluir sobremesa.");
    });
});


// Cadastrar adicional
btnCadastrarA.addEventListener("click", () => {
  const nome = nomeAdicionalInput.value.trim();
  const preco = parsePreco(precoAdicionalInput.value);

  if (!nome || preco <= 0) {
    alert("Preencha o nome e um preço válido.");
    return;
  }

  const adicional = { nome, preco };

  fetch("http://localhost:3000/adicionais", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adicional),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar adicional:", err);
      alert("Erro ao cadastrar adicional.");
    });
});


// Atualizar adicional
btnAtualizarA.addEventListener("click", () => {
  const id = parseInt(idAdicionalInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para atualizar.");
    return;
  }

  const nome = nomeAdicionalInput.value.trim();
  const preco = parsePreco(precoAdicionalInput.value);

  const adicional: any = {};
  if (nome) adicional.nome = nome;
  if (preco > 0) adicional.preco = preco;

  if (Object.keys(adicional).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/adicionais/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adicional),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar adicional:", err);
      alert("Erro ao atualizar adicional.");
    });
});

// Excluir adicional
btnExcluirA.addEventListener("click", () => {
  const id = parseInt(idAdicionalInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para excluir.");
    return;
  }

  fetch(`http://localhost:3000/adicionais/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir adicional:", err);
      alert("Erro ao excluir adicional.");
    });
});

// Cadastrar Cliente
btnCadastrarC.addEventListener("click", () => {
  const cpf = cpfClienteInput.value.trim();
  const nome = nomeClienteInput.value.trim();
  const telefone = telefoneClienteInput.value.trim();
  const endereco = enderecoClienteInput.value.trim();

  if (!cpf || !nome || !telefone || !endereco) {
    alert("Preencha todos os campos para cadastrar o cliente.");
    return;
  }

  const cliente = { cpf, nome, telefone, endereco };

  fetch("http://localhost:3000/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar cliente:", err);
      alert("Erro ao cadastrar cliente.");
    });
});


// Atualizar adicional
btnAtualizarC.addEventListener("click", () => {
  const cpf = cpfClienteInput.value.trim();
  if (!cpf) {
    alert("Informe o CPF do cliente para atualizar.");
    return;
  }

  const nome = nomeClienteInput.value.trim();
  const telefone = telefoneClienteInput.value.trim();
  const endereco = enderecoClienteInput.value.trim();

  const cliente: any = {};
  if (nome) cliente.nome = nome;
  if (telefone) cliente.telefone = telefone;
  if (endereco) cliente.endereco = endereco;

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
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar cliente:", err);
      alert("Erro ao atualizar cliente.");
    });
});


// Excluir adicional
btnExcluirC.addEventListener("click", () => {
  const cpf = cpfClienteInput.value.trim();
  if (!cpf) {
    alert("Informe o CPF do cliente para excluir.");
    return;
  }

  fetch(`http://localhost:3000/clientes/${cpf}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir cliente:", err);
      alert("Erro ao excluir cliente.");
    });
});

let nomeValor = "";
let relatorioTxt = "";

btnProcurarProd.addEventListener("click", () => {
  produtoDiv.innerHTML = "";
  listaVendas.innerHTML = "";
  nomeValor = NomeProduto.value.trim();
  const tipoValor = produtoEsc.value;
  const inicioValor = DataInicio.value;
  const fimValor = DataFim.value;

  if (!tipoValor || !nomeValor || !inicioValor || !fimValor) {
    alert("Preencha todos os campos.");
    return;
  }

  fetch(`http://localhost:3000/produtos-vendidos?tipo=${tipoValor}&nome=${nomeValor}&inicio=${inicioValor}&fim=${fimValor}`)
    .then(res => res.json())
    .then(data => {
      const campo = tipoToCampo(tipoValor);
      relatorioTxt = data.txt;

      // Calcula o total de itens vendidos
      let totalItens = 0;
      data.vendas.forEach((v: any) => {
        totalItens += v[`quantidade_${campo}`];
      });

      // Exibe os dados no HTML
      listaVendas.innerHTML = "";
      data.vendas.forEach((v: any) => {
        const item = document.createElement("p");
        item.textContent = `Data: ${new Date(v.data_pedido).toLocaleString()} | Quantidade: ${v[`quantidade_${campo}`]}`;
        item.style.marginBottom = "10px";
        listaVendas.appendChild(item);
      });

      produtoDiv.innerHTML = `
        <h3>Histórico de vendas de ${nomeValor}</h3>
        <pre>${relatorioTxt}</pre>
        <p><strong>Total de itens vendidos:</strong> ${totalItens}</p>
      `;

      limparRelatorioBtn.style.display = "block";
      const relatorioFinal = `${relatorioTxt}\n\nTotal de itens vendidos: ${totalItens}`;


      // ✅ Gera e baixa o arquivo automaticamente
      const blob = new Blob([relatorioFinal], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-${nomeValor}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error("Erro ao buscar produtos vendidos:", err);
      alert("Erro ao buscar produtos vendidos.");
    });

  ;

  produtoEsc.selectedIndex = 0; // volta para "Selecione um produto"
  NomeProduto.value = "";
  DataInicio.value = "";
  DataFim.value = "";
});

function tipoToCampo(tipo: string): string {
  return {
    '1': 'pizza',
    '2': 'bebida',
    '3': 'sobremesa',
    '4': 'adicional'
  }[tipo] || '';
}

limparRelatorioBtn.addEventListener("click", () => {
  produtoDiv.innerHTML = ""; // limpa o conteúdo do relatório
  limparRelatorioBtn.style.display = "none"; // esconde o botão junto
});

