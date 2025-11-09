"use strict";
var _a;
const btnBuscarCompras = document.getElementById("btnBuscarCompras");
const cpfInput = document.getElementById("cpfClienteH");
const dataInicioInput = document.getElementById("dataInicioCliente");
const dataFimInput = document.getElementById("dataFimCliente");
const resultadoDiv = document.getElementById("resultadoCompras");
const btnLimparTudo = document.getElementById("btnLimparTudo");
const limparContainer = document.getElementById("limparContainer");
let historicoAtual = [];
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
        }
        else {
            historicoAtual = data.pedidos; // salva para exportação
            const lista = data.pedidos.map((p) => `
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
(_a = document.getElementById("btnExportarTxt")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    if (historicoAtual.length === 0) {
        alert("Nenhum histórico carregado para exportar.");
        return;
    }
    const linhas = historicoAtual.map((p, i) => {
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
        const campo = document.getElementById(id);
        if (campo)
            campo.value = "";
    });
    // Oculta o botão
    limparContainer.style.display = "none";
    alert("Todos os campos foram limpos!");
});
//# sourceMappingURL=histcompra.js.map