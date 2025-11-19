"use strict";
const nomeInput = document.getElementById("nomePizza");
const precoInput = document.getElementById("precoPizza");
const tamanhoSelect = document.getElementById("tamanhoPizza");
const idInput = document.getElementById("idPizza");
const nomeBebidaInput = document.getElementById("nomeBebida");
const precoBebidaInput = document.getElementById("precoBebida");
const idBebidaInput = document.getElementById("idBebida");
const nomeSobremesaInput = document.getElementById("nomeSobremesa");
const precoSobremesaInput = document.getElementById("precoSobremesa");
const idSobremesaInput = document.getElementById("idSobremesa");
const nomeAdicionalInput = document.getElementById("nomeAdicional");
const precoAdicionalInput = document.getElementById("precoAdicional");
const idAdicionalInput = document.getElementById("idAdicional");
const cpfClienteInput = document.getElementById("CpfCliente");
const nomeClienteInput = document.getElementById("NomeCliente");
const telefoneClienteInput = document.getElementById("TelefoneCliente");
const enderecoClienteInput = document.getElementById("EnderecoCliente");
const senhaClienteInput = document.getElementById("SenhaCliente");
const produtoEsc = document.getElementById("produtoesc");
const NomeProduto = document.getElementById("NomeProduto");
const DataInicio = document.getElementById("DataInicio");
const DataFim = document.getElementById("DataFim");
const produtoDiv = document.getElementById("produtodevs");
const listaVendas = document.getElementById("lista-vendas");
const resultadoCompras = document.getElementById("resultadoCompras");
const limparRelatorioBtn = document.getElementById("limparRelatorio");
const btnCadastrarB = document.getElementById("cadastrabebida");
const btnAtualizarB = document.getElementById("alterabebida");
const btnExcluirB = document.getElementById("excluibebida");
const btnCadastrarP = document.getElementById("cadastrapizza");
const btnAtualizarP = document.getElementById("alterapizza");
const btnExcluirP = document.getElementById("excluipizza");
const btnExcluirS = document.getElementById("excluisobremesa");
const btnCadastrarS = document.getElementById("cadastrasobremesa");
const btnAtualizarS = document.getElementById("alterasobremesa");
const btnCadastrarA = document.getElementById("cadastraadicional");
const btnAtualizarA = document.getElementById("alteraadicional");
const btnExcluirA = document.getElementById("excluiadicional");
const btnCadastrarC = document.getElementById("cadastracliente");
const btnAtualizarC = document.getElementById("alteracliente");
const btnExcluirC = document.getElementById("excluicliente");
// Utilitário para converter preço corretamente
function parsePreco(valor) {
    // Troca vírgula por ponto para evitar erro de parse
    const normalizado = valor.replace(',', '.');
    const preco = parseFloat(normalizado);
    // Se não for número válido, retorna 0
    return isNaN(preco) ? 0 : preco;
}
// Limpar campos do formulário
function limparCampos() {
    // Zera todos os inputs relacionados a pizza, bebida, sobremesa, adicional e cliente
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
    senhaClienteInput.value = "";
}
// -----------------------------
// Cadastrar pizza
// -----------------------------
btnCadastrarP.addEventListener("click", () => {
    var _a, _b;
    // Captura valores do formulário
    const nome = nomeInput.value.trim();
    const tamanho = (_b = (_a = tamanhoSelect.options[tamanhoSelect.selectedIndex]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
    const preco = parsePreco(precoInput.value);
    // Monta objeto pizza
    const pizza = { nome, tamanho, preco };
    // Faz requisição POST para a API
    fetch("http://localhost:3000/pizzas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pizza),
    })
        .then(res => res.json())
        .then(data => {
        // Mostra mensagem de sucesso ou erro
        alert(data.message || data.error);
        limparCampos(); // Limpa formulário
    })
        .catch(err => {
        console.error("Erro ao cadastrar:", err);
        alert("Erro ao cadastrar pizza.");
    });
});
// -----------------------------
// Atualizar pizza
// -----------------------------
btnAtualizarP.addEventListener("click", () => {
    var _a, _b;
    const id = parseInt(idInput.value);
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para atualizar.");
        return;
    }
    // Captura valores
    const nome = nomeInput.value.trim();
    const tamanho = (_b = (_a = tamanhoSelect.options[tamanhoSelect.selectedIndex]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
    const preco = parsePreco(precoInput.value);
    // Monta objeto pizza dinamicamente (apenas campos preenchidos)
    const pizza = {};
    if (nome)
        pizza.nome = nome;
    if (tamanho && tamanho !== "Selecione um tamanho:")
        pizza.tamanho = tamanho;
    if (preco > 0)
        pizza.preco = preco;
    if (Object.keys(pizza).length === 0) {
        alert("Preencha ao menos um campo para atualizar.");
        return;
    }
    // Faz requisição PUT para atualizar pizza
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
// -----------------------------
// Excluir pizza
// -----------------------------
btnExcluirP.addEventListener("click", () => {
    const id = parseInt(idInput.value);
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para excluir.");
        return;
    }
    // Faz requisição DELETE para excluir pizza
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
// -----------------------------
// Cadastrar bebida
// -----------------------------
btnCadastrarB.addEventListener("click", () => {
    const nome = nomeBebidaInput.value.trim(); // pega o nome da bebida
    const preco = parsePreco(precoBebidaInput.value); // converte preço para número
    // Validação
    if (!nome || preco <= 0) {
        alert("Preencha o nome e um preço válido.");
        return;
    }
    const bebida = { nome, preco }; // objeto bebida
    // Requisição POST para cadastrar bebida
    fetch("http://localhost:3000/bebidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bebida),
    })
        .then(res => res.json())
        .then(data => {
        alert(data.message || data.error); // mostra mensagem da API
        limparCampos(); // limpa formulário
    })
        .catch(err => {
        console.error("Erro ao cadastrar bebida:", err);
        alert("Erro ao cadastrar bebida.");
    });
});
// -----------------------------
// Atualizar bebida
// -----------------------------
btnAtualizarB.addEventListener("click", () => {
    const id = parseInt(idBebidaInput.value); // pega ID da bebida
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para atualizar.");
        return;
    }
    const nome = nomeBebidaInput.value.trim();
    const preco = parsePreco(precoBebidaInput.value);
    // Monta objeto dinamicamente
    const bebida = {};
    if (nome)
        bebida.nome = nome;
    if (preco > 0)
        bebida.preco = preco;
    if (Object.keys(bebida).length === 0) {
        alert("Preencha ao menos um campo para atualizar.");
        return;
    }
    // Requisição PUT para atualizar bebida
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
// -----------------------------
// Excluir bebida
// -----------------------------
btnExcluirB.addEventListener("click", () => {
    const id = parseInt(idBebidaInput.value); // pega ID
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para excluir.");
        return;
    }
    // Requisição DELETE para excluir bebida
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
// -----------------------------
// Cadastrar sobremesa
// -----------------------------
btnCadastrarS.addEventListener("click", () => {
    const nome = nomeSobremesaInput.value.trim();
    const preco = parsePreco(precoSobremesaInput.value);
    if (!nome || preco <= 0) {
        alert("Preencha o nome e um preço válido.");
        return;
    }
    const sobremesa = { nome, preco };
    // Requisição POST para cadastrar sobremesa
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
// -----------------------------
// Atualizar sobremesa
// -----------------------------
btnAtualizarS.addEventListener("click", () => {
    const id = parseInt(idSobremesaInput.value);
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para atualizar.");
        return;
    }
    const nome = nomeSobremesaInput.value.trim();
    const preco = parsePreco(precoSobremesaInput.value);
    const sobremesa = {};
    if (nome)
        sobremesa.nome = nome;
    if (preco > 0)
        sobremesa.preco = preco;
    if (Object.keys(sobremesa).length === 0) {
        alert("Preencha ao menos um campo para atualizar.");
        return;
    }
    // Requisição PUT para atualizar sobremesa
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
// -----------------------------
// Excluir sobremesa
// -----------------------------
btnExcluirS.addEventListener("click", () => {
    const id = parseInt(idSobremesaInput.value);
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para excluir.");
        return;
    }
    // Requisição DELETE para excluir sobremesa
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
// -----------------------------
// Cadastrar adicional
// -----------------------------
btnCadastrarA.addEventListener("click", () => {
    const nome = nomeAdicionalInput.value.trim(); // pega nome do adicional
    const preco = parsePreco(precoAdicionalInput.value); // converte preço para número
    // Validação
    if (!nome || preco <= 0) {
        alert("Preencha o nome e um preço válido.");
        return;
    }
    const adicional = { nome, preco };
    // Requisição POST para cadastrar adicional
    fetch("http://localhost:3000/adicionais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adicional),
    })
        .then(res => res.json())
        .then(data => {
        alert(data.message || data.error); // mostra resposta da API
        limparCampos(); // limpa formulário
    })
        .catch(err => {
        console.error("Erro ao cadastrar adicional:", err);
        alert("Erro ao cadastrar adicional.");
    });
});
// -----------------------------
// Atualizar adicional
// -----------------------------
btnAtualizarA.addEventListener("click", () => {
    const id = parseInt(idAdicionalInput.value); // pega ID do adicional
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para atualizar.");
        return;
    }
    const nome = nomeAdicionalInput.value.trim();
    const preco = parsePreco(precoAdicionalInput.value);
    // Monta objeto dinamicamente
    const adicional = {};
    if (nome)
        adicional.nome = nome;
    if (preco > 0)
        adicional.preco = preco;
    if (Object.keys(adicional).length === 0) {
        alert("Preencha ao menos um campo para atualizar.");
        return;
    }
    // Requisição PUT para atualizar adicional
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
// -----------------------------
// Excluir adicional
// -----------------------------
btnExcluirA.addEventListener("click", () => {
    const id = parseInt(idAdicionalInput.value);
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para excluir.");
        return;
    }
    // Requisição DELETE para excluir adicional
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
// -----------------------------
// Cadastrar cliente
// -----------------------------
btnCadastrarC.addEventListener("click", () => {
    const cpf = cpfClienteInput.value.trim();
    const nome = nomeClienteInput.value.trim();
    const telefone = telefoneClienteInput.value.trim();
    let endereco = enderecoClienteInput.value.trim();
    const senha = senhaClienteInput.value.trim(); // senha obrigatória
    // Validação
    if (!cpf || !nome || !telefone || !senha) {
        alert("Preencha CPF, nome, telefone e senha para cadastrar o cliente.");
        return;
    }
    if (!endereco) {
        endereco = "Retirar no local"; // valor padrão
    }
    const cliente = { cpf, nome, telefone, endereco, senha };
    // Requisição POST para cadastrar cliente
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
// -----------------------------
// Atualizar cliente
// -----------------------------
btnAtualizarC.addEventListener("click", () => {
    const cpf = cpfClienteInput.value.trim();
    if (!cpf) {
        alert("Informe o CPF do cliente para atualizar.");
        return;
    }
    const nome = nomeClienteInput.value.trim();
    const telefone = telefoneClienteInput.value.trim();
    const endereco = enderecoClienteInput.value.trim();
    const senha = senhaClienteInput.value.trim();
    // Monta objeto dinamicamente
    const cliente = {};
    if (nome)
        cliente.nome = nome;
    if (telefone)
        cliente.telefone = telefone;
    if (endereco)
        cliente.endereco = endereco;
    if (senha)
        cliente.senha = senha;
    if (Object.keys(cliente).length === 0) {
        alert("Preencha ao menos um campo para atualizar.");
        return;
    }
    // Requisição PUT para atualizar cliente
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
// -----------------------------
// Excluir cliente
// -----------------------------
btnExcluirC.addEventListener("click", () => {
    const cpf = cpfClienteInput.value.trim();
    if (!cpf) {
        alert("Informe o CPF do cliente para excluir.");
        return;
    }
    // Requisição DELETE para excluir cliente
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
//# sourceMappingURL=cadastro.js.map