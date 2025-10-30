"use strict";
// ---- Elementos do DOM ----
const sabor = document.getElementById("Sabor");
const tamanho = document.getElementById("tamanho");
const qtdPizza = document.getElementById("quantidade_pizza");
const bebida = document.getElementById("bebida");
const qtdBebida = document.getElementById("quantidade_bebida");
const blocoNotas = document.getElementById("blocoNotas");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnEnviar = document.getElementById("btnEnviar");
const campoData = document.getElementById("data_pedido");
// Campos do cliente
const inputCPF = document.querySelector('input[aria-label="CPF"]');
const inputNome = document.querySelector('input[aria-label="First name"]');
const inputTelefone = document.querySelector('input[type="tel"]');
const inputEndereco = document.querySelector('input[placeholder^="Ex: Rua"]');
const inputPagamento = document.querySelector('input[placeholder^="Pix"]');
// ---- Arrays de pedidos ----
const pedidos = [];
let cliente = null;
// ---- Adiciona pedido ----
btnAdicionar.addEventListener("click", () => {
    const pizzaSelecionada = sabor.selectedIndex > 0;
    const bebidaSelecionada = bebida.selectedIndex > 0;
    if (!pizzaSelecionada && !bebidaSelecionada) {
        alert("Selecione pelo menos uma pizza ou uma bebida.");
        return;
    }
    // Captura dados do cliente
    const cpf = inputCPF.value.trim();
    const nome = inputNome.value.trim();
    const telefone = inputTelefone.value.trim();
    const endereco = inputEndereco.value.trim();
    const pagamento = inputPagamento.value.trim();
    // Validações
    if (!/^\d{11}$/.test(cpf)) {
        alert("CPF inválido! Deve conter 11 números.");
        return;
    }
    if (!/^[A-Za-zÀ-ÿ\s]{3,}$/.test(nome)) {
        alert("Nome inválido! Min 3 letras.");
        return;
    }
    if (!/^\d+$/.test(telefone)) {
        alert("Telefone inválido! Apenas números.");
        return;
    }
    if (!endereco || !pagamento) {
        alert("Preencha todos os dados do cliente!");
        return;
    }
    // Data atual
    const dataAtual = new Date().toISOString().split('T')[0];
    if (campoData)
        campoData.value = dataAtual;
    // Cria o novo pedido
    const novoPedido = {
        pizza: pizzaSelecionada ? sabor.options[sabor.selectedIndex].text : "",
        tamanho: pizzaSelecionada ? tamanho.options[tamanho.selectedIndex].text : "",
        quantidadePizza: pizzaSelecionada ? Number(qtdPizza.value) : 0,
        bebida: bebidaSelecionada ? bebida.options[bebida.selectedIndex].text : "",
        quantidadeBebida: bebidaSelecionada ? Number(qtdBebida.value) : 0,
        data_pedido: (campoData === null || campoData === void 0 ? void 0 : campoData.value) || dataAtual // garante que nunca fique undefined
    };
    pedidos.push(novoPedido);
    atualizarBlocoNotas();
});
// ---- Atualiza visualmente o bloco de notas ----
function atualizarBlocoNotas() {
    blocoNotas.innerHTML = "";
    pedidos.forEach((p, i) => {
        const partes = [];
        if (p.quantidadePizza > 0 && p.pizza)
            partes.push(`${p.quantidadePizza}x Pizza ${p.pizza} (${p.tamanho})`);
        if (p.quantidadeBebida > 0 && p.bebida)
            partes.push(`${p.quantidadeBebida}x ${p.bebida}`);
        blocoNotas.innerHTML += `<p><strong>Pedido ${i + 1} (${p.data_pedido}):</strong> ${partes.join(" + ")}</p>`;
    });
}
// ---- Gera CSV ----
function gerarCSV(cliente, pedidos) {
    const headerCliente = "CPF,Nome,Telefone,Endereço,Pagamento";
    const dadosCliente = `${cliente.cpf},${cliente.nome},${cliente.telefone},${cliente.endereco},${cliente.pagamento}`;
    const headerPedido = "Pizza,Tamanho,QuantidadePizza,Bebida,QuantidadeBebida,DataPedido";
    const linhasPedido = pedidos.map(p => `${p.pizza},${p.tamanho},${p.quantidadePizza},${p.bebida},${p.quantidadeBebida},${p.data_pedido}`);
    return [headerCliente, dadosCliente, "", headerPedido, ...linhasPedido].join("\n");
}
// ---- Gera recibo ----
function gerarRecibo(cliente, pedidos) {
    let recibo = `🧾 ------------- RECIBO DO PEDIDO -------------\n\nCLIENTE: ${cliente.nome}\nCPF: ${cliente.cpf}\nTELEFONE: ${cliente.telefone}\nENDEREÇO: ${cliente.endereco}\nPAGAMENTO: ${cliente.pagamento}\n\n`;
    let totalItens = 0;
    pedidos.forEach((p, i) => {
        const partes = [];
        if (p.quantidadePizza > 0) {
            partes.push(`${p.quantidadePizza}x Pizza ${p.pizza} (${p.tamanho})`);
            totalItens += p.quantidadePizza;
        }
        if (p.quantidadeBebida > 0) {
            partes.push(`${p.quantidadeBebida}x ${p.bebida}`);
            totalItens += p.quantidadeBebida;
        }
        if (partes.length)
            recibo += `Pedido ${i + 1} (${p.data_pedido}): ${partes.join(" + ")}\n`;
    });
    recibo += `\nTOTAL DE ITENS: ${totalItens}`;
    return recibo;
}
// ---- Cria e baixa arquivo ----
function baixarArquivo(nome, conteudo, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nome;
    a.click();
    URL.revokeObjectURL(url);
}
// ---- Envia para backend ----
btnEnviar.addEventListener("click", () => {
    if (!pedidos.length) {
        alert("Adicione pelo menos um item!");
        return;
    }
    const clienteData = {
        cpf: inputCPF.value.trim(),
        nome: inputNome.value.trim(),
        telefone: inputTelefone.value.trim(),
        endereco: inputEndereco.value.trim(),
        pagamento: inputPagamento.value.trim(),
    };
    // Validações simples
    if (!/^\d{11}$/.test(clienteData.cpf) || !/^[A-Za-zÀ-ÿ\s]{3,}$/.test(clienteData.nome) || !/^\d{8,15}$/.test(clienteData.telefone) || !clienteData.endereco || !clienteData.pagamento) {
        alert("Dados do cliente inválidos!");
        return;
    }
    // Gera arquivos
    const csv = gerarCSV(clienteData, pedidos);
    const recibo = gerarRecibo(clienteData, pedidos);
    baixarArquivo("recibo.txt", recibo, "text/plain");
    console.log("CSV armazenado internamente:\n", csv);
    // Envia para backend
    console.log("Enviando para backend:", JSON.stringify({ cliente: clienteData, pedidos }, null, 2));
    fetch("http://localhost:3000/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente: clienteData, pedidos })
    })
        .then(res => res.json())
        .then(data => {
        alert(data.message || "Pedido enviado com sucesso!");
        pedidos.length = 0;
        blocoNotas.innerHTML = "";
    })
        .catch(err => {
        console.error("Erro ao enviar pedido:", err);
        alert("Erro ao enviar pedido.");
    });
});
//# sourceMappingURL=pedido.js.map