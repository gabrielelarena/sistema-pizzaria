"use strict";
var _a, _b, _c, _d;
// Inputs e botões do formulário de clientes
const idClienteInput = document.getElementById("idcliente");
const cpfClienteConsulta = document.getElementById("CpfCliente");
const nomeClienteConsulta = document.getElementById("NomeCliente");
const resultadoClienteDiv = document.getElementById("resultadoCliente");
const btnConsultaCliente = document.getElementById("consultacliente");
// -----------------------------
// Função genérica para consultar produto por tipo e ID
// -----------------------------
function consultarProduto(tipo, id) {
    if (!id || isNaN(parseInt(id))) {
        alert("Informe um ID válido.");
        return;
    }
    // Faz requisição GET para a API passando tipo e id
    fetch(`http://localhost:3000/produto?tipo=${tipo}&id=${id}`)
        .then(res => res.json())
        .then(data => {
        if (data.error) {
            alert(data.error); // mostra erro retornado pela API
        }
        else {
            const p = data.produto;
            // Exibe informações do produto encontrado
            alert(`Produto encontrado:\nNome: ${p.nome}\nPreço: R$ ${p.preco}${p.tamanho ? `\nTamanho: ${p.tamanho}` : ""}`);
        }
    })
        .catch(err => {
        console.error("Erro ao consultar produto:", err);
        alert("Erro ao consultar produto.");
    });
}
// -----------------------------
// Eventos de clique para cada tipo de produto
// -----------------------------
(_a = document.getElementById("consultapizza")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const id = document.getElementById("idPizza").value.trim();
    consultarProduto("pizza", id);
});
(_b = document.getElementById("consultabebida")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    const id = document.getElementById("idBebida").value.trim();
    consultarProduto("bebida", id);
});
(_c = document.getElementById("consultasobremesa")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    const id = document.getElementById("idSobremesa").value.trim();
    consultarProduto("sobremesa", id);
});
(_d = document.getElementById("consultaadicional")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
    const id = document.getElementById("idAdicional").value.trim();
    consultarProduto("adicional", id);
});
// -----------------------------
// Consulta de clientes
// -----------------------------
btnConsultaCliente.addEventListener("click", () => {
    resultadoClienteDiv.innerHTML = ""; // limpa resultado anterior
    const id = idClienteInput.value.trim();
    const cpf = cpfClienteConsulta.value.trim();
    const nome = nomeClienteConsulta.value.trim();
    // Validação: precisa preencher ao menos um campo
    if (!id && !cpf && !nome) {
        resultadoClienteDiv.innerHTML = `<p class="text-danger">Preencha ao menos um campo para consultar.</p>`;
        return;
    }
    // Monta query string dinamicamente
    const params = new URLSearchParams();
    if (id)
        params.append("id", id);
    if (cpf)
        params.append("cpf", cpf);
    if (nome)
        params.append("nome", nome);
    // Faz requisição GET para a API
    fetch(`http://localhost:3000/clientes?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
        if (data.error) {
            resultadoClienteDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
        }
        else {
            // Monta lista de clientes encontrados
            const lista = data.clientes.map((c) => `
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
            resultadoClienteDiv.innerHTML = lista; // insere no HTML
        }
    })
        .catch(err => {
        console.error("Erro ao consultar cliente:", err);
        resultadoClienteDiv.innerHTML = `<p class="text-danger">Erro ao consultar cliente.</p>`;
    });
});
//# sourceMappingURL=consultatab.js.map