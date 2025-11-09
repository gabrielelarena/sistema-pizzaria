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
    var _a, _b;
    const nome = nomeInput.value.trim();
    const tamanho = (_b = (_a = tamanhoSelect.options[tamanhoSelect.selectedIndex]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
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
    var _a, _b;
    const id = parseInt(idInput.value);
    if (isNaN(id) || id <= 0) {
        alert("Informe um ID válido para atualizar.");
        return;
    }
    const nome = nomeInput.value.trim();
    const tamanho = (_b = (_a = tamanhoSelect.options[tamanhoSelect.selectedIndex]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
    const preco = parsePreco(precoInput.value);
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
    const bebida = {};
    if (nome)
        bebida.nome = nome;
    if (preco > 0)
        bebida.preco = preco;
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
    const sobremesa = {};
    if (nome)
        sobremesa.nome = nome;
    if (preco > 0)
        sobremesa.preco = preco;
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
    const adicional = {};
    if (nome)
        adicional.nome = nome;
    if (preco > 0)
        adicional.preco = preco;
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
    let endereco = enderecoClienteInput.value.trim();
    if (!cpf || !nome || !telefone) {
        alert("Preencha CPF, nome e telefone para cadastrar o cliente.");
        return;
    }
    // Aplica valor padrão se o campo estiver vazio
    if (!endereco) {
        endereco = "Retirar no local";
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
// Atualizar cliente
btnAtualizarC.addEventListener("click", () => {
    const cpf = cpfClienteInput.value.trim();
    if (!cpf) {
        alert("Informe o CPF do cliente para atualizar.");
        return;
    }
    const nome = nomeClienteInput.value.trim();
    const telefone = telefoneClienteInput.value.trim();
    const endereco = enderecoClienteInput.value.trim();
    const cliente = {};
    if (nome)
        cliente.nome = nome;
    if (telefone)
        cliente.telefone = telefone;
    if (endereco)
        cliente.endereco = endereco;
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
// Excluir cliente
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
//# sourceMappingURL=cadastro.js.map