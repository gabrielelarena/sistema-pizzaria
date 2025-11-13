// Campos de seleção de pedido
const sabor = document.getElementById("Sabor");
const tamanho = document.getElementById("tamanho");
const qtdPizza = document.getElementById("quantidade_pizza");
const bebida = document.getElementById("bebida");
const qtdBebida = document.getElementById("quantidade_bebida");
const sobremesa = document.getElementById("sobremesa");
const qtdSobremesa = document.getElementById("quantidade_sobremesa");
const adicional = document.getElementById('adicional');
const qtdAdicional = document.getElementById('quantidade_adicional');
const valorTotal = document.getElementById("valorTotal");
// Campos de dados do cliente
const inputCPF = document.getElementById("cpf");
const inputNome = document.getElementById("nome");
const inputTelefone = document.getElementById("telefone");
const inputEndereco = document.getElementById("endereco");
const inputPagamento = document.getElementById("pagamento");
// Campos adicionais
const inputObservacoes = document.getElementById("observacoes");
const inputCupom = document.getElementById("cupom");
// Elementos de controle
const blocoNotas = document.getElementById("blocoNotas");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnEnviar = document.getElementById("btnEnviar");
const pedidos = [];
btnAdicionar.addEventListener("click", () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const pizzaSelecionada = sabor.selectedIndex > 0;
    const bebidaSelecionada = bebida.selectedIndex > 0;
    const sobremesaSelecionada = sobremesa.selectedIndex > 0;
    const adicionalSelecionado = adicional.selectedIndex > 0;
    if (!pizzaSelecionada && !bebidaSelecionada && !sobremesaSelecionada && !adicionalSelecionado) {
        alert("Selecione pelo menos uma pizza, bebida, sobremesa ou adicional.");
        return;
    }
    const cpf = inputCPF.value.trim();
    const nome = inputNome.value.trim();
    const telefone = inputTelefone.value.trim();
    const pagamento = inputPagamento.value.trim();
    const cpfValido = /^\d{11}$/.test(cpf);
    const nomeValido = /^[A-Za-zÀ-ÿ\s]{3,}$/.test(nome);
    const telefoneValido = /^\d+$/.test(telefone);
    if (!cpfValido) {
        alert("CPF inválido! Deve conter exatamente 11 números, sem pontuações ou espaços.");
        return;
    }
    if (!nomeValido) {
        alert("Nome inválido! Deve conter no mínimo 3 letras e apenas letras.");
        return;
    }
    if (!telefoneValido) {
        alert("Telefone inválido! Deve conter apenas números.");
        return;
    }
    if (!pagamento) {
        alert("Preencha o campo Forma de Pagamento também!");
        return;
    }
    const dataAtual = new Date();
    const data_pedido = `${dataAtual.toLocaleDateString("pt-BR")} - ${dataAtual.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })}`;
    const novoPedido = {
        data_pedido,
        cpf,
        pizza: pizzaSelecionada ? (_b = (_a = sabor.options[sabor.selectedIndex]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "" : "",
        tamanho: pizzaSelecionada ? (_d = (_c = tamanho.options[tamanho.selectedIndex]) === null || _c === void 0 ? void 0 : _c.text) !== null && _d !== void 0 ? _d : "" : "",
        quantidade_pizza: pizzaSelecionada ? Number(qtdPizza.value) : 0,
        bebida: bebidaSelecionada ? (_f = (_e = bebida.options[bebida.selectedIndex]) === null || _e === void 0 ? void 0 : _e.text) !== null && _f !== void 0 ? _f : "" : "",
        quantidade_bebida: bebidaSelecionada ? Number(qtdBebida.value) : 0,
        sobremesa: sobremesaSelecionada ? (_h = (_g = sobremesa.options[sobremesa.selectedIndex]) === null || _g === void 0 ? void 0 : _g.text) !== null && _h !== void 0 ? _h : "" : "",
        quantidade_sobremesa: sobremesaSelecionada ? Number(qtdSobremesa.value) : 0,
        adicional: adicionalSelecionado ? (_k = (_j = adicional.options[adicional.selectedIndex]) === null || _j === void 0 ? void 0 : _j.text) !== null && _k !== void 0 ? _k : "" : "",
        quantidade_adicional: adicionalSelecionado ? Number(qtdAdicional.value) : 0,
        observacoes: inputObservacoes.value.trim(),
        forma_pagamento: pagamento,
        preco_total: 0, // pode ser calculado depois
        cupom: inputCupom.value.trim()
    };
    fetch("http://localhost:3000/calcular-preco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPedido)
    })
        .then((res) => res.json())
        .then((data) => {
        novoPedido.preco_total = data.preco_total;
        pedidos.push(novoPedido);
        atualizarBlocoNotas();
    })
        .catch((err) => {
        console.error("Erro ao calcular preço:", err);
        alert("Erro ao calcular preço do pedido.");
    });
});
// Atualiza visualmente o bloco de notas
function atualizarBlocoNotas() {
    blocoNotas.innerHTML = "";
    let valorTotalGeral = 0;
    pedidos.forEach((p, index) => {
        const partes = [];
        if (p.quantidade_pizza > 0 && p.pizza) {
            partes.push(`${p.quantidade_pizza}x Pizza ${p.pizza} (${p.tamanho})`);
        }
        if (p.quantidade_bebida > 0 && p.bebida) {
            partes.push(`${p.quantidade_bebida}x ${p.bebida}`);
        }
        if (p.quantidade_sobremesa > 0 && p.sobremesa) {
            partes.push(`${p.quantidade_sobremesa}x Sobremesa ${p.sobremesa}`);
        }
        if (p.quantidade_adicional > 0 && p.adicional) {
            partes.push(`${p.quantidade_adicional}x Adicional ${p.adicional}`);
        }
        valorTotalGeral += p.preco_total;
        const pedidoHTML = `
      <div class="pedido-bloco" style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
        <p><strong>Pedido ${index + 1}:</strong> ${partes.join(" + ")}</p>
        <p><strong>Valor do pedido:</strong> R$ ${p.preco_total.toFixed(2)}</p>
      </div>
    `;
        blocoNotas.innerHTML += pedidoHTML;
    });
    // 🚚 Se endereço preenchido, soma frete
    if (inputEndereco.value.trim() !== "") {
        valorTotalGeral += 5;
        blocoNotas.innerHTML += `<p><strong>Frete:</strong> R$ 5,00</p>`;
    }
    valorTotal.textContent = `Total: R$ ${valorTotalGeral.toFixed(2)}`;
    // Limpa os campos de seleção após adicionar ao bloco de notas
    sabor.selectedIndex = 0;
    tamanho.selectedIndex = 0;
    qtdPizza.value = "1";
    bebida.selectedIndex = 0;
    qtdBebida.value = "1";
    sobremesa.selectedIndex = 0;
    qtdSobremesa.value = "1";
    adicional.selectedIndex = 0;
    qtdAdicional.value = "1";
}
function gerarCSV(cliente, pedidos) {
    const enderecoFinal = cliente.endereco || "Retirar no local";
    const headerCliente = "CPF,Nome,Telefone,Endereço";
    const dadosCliente = `${cliente.cpf},${cliente.nome},${cliente.telefone},${enderecoFinal}`;
    // Data atual formatada
    const dataAtual = new Date();
    const dataFormatada = `${dataAtual.toLocaleDateString("pt-BR")} - ${dataAtual.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })}`;
    const headerPedido = "Pizza,Tamanho,Quantidade_Pizza,Bebida,Quantidade_Bebida,Sobremesa,Quantidade_Sobremesa,Adicional,Quantidade_Adicional,Observações,FormaPagamento,PreçoTotal,Cupom";
    const linhasPedido = pedidos.map(p => `${p.pizza},${p.tamanho},${p.quantidade_pizza},${p.bebida},${p.quantidade_bebida},${p.sobremesa},${p.quantidade_sobremesa},${p.adicional},${p.quantidade_adicional},${p.observacoes},${p.forma_pagamento},${p.preco_total},${p.cupom}`);
    return [
        `Data do Pedido: ${dataFormatada}`,
        headerCliente,
        dadosCliente,
        "",
        headerPedido,
        ...linhasPedido
    ].join("\n");
}
function gerarRecibo(cliente, pedidos) {
    const agora = new Date();
    const data_pedido = `${agora.toLocaleDateString("pt-BR")} - ${agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })}`;
    const enderecoFinal = cliente.endereco.trim() === "" ? "Retirar no local" : cliente.endereco;
    let recibo = `🧾 ------------- RECIBO DO PEDIDO -------------

DATA: ${data_pedido}
CLIENTE: ${cliente.nome}
CPF: ${cliente.cpf}
TELEFONE: ${cliente.telefone}
ENDEREÇO: ${enderecoFinal}

`;
    let totalItens = 0;
    let valorTotal = 0;
    const itensPedido = [];
    const itensAdicionais = [];
    pedidos.forEach((p) => {
        if (p.quantidade_pizza > 0 && p.pizza) {
            itensPedido.push(`${p.quantidade_pizza}x Pizza ${p.pizza} (${p.tamanho})`);
            totalItens += p.quantidade_pizza;
        }
        if (p.quantidade_bebida > 0 && p.bebida) {
            itensPedido.push(`${p.quantidade_bebida}x ${p.bebida}`);
            totalItens += p.quantidade_bebida;
        }
        if (p.quantidade_sobremesa > 0 && p.sobremesa) {
            itensPedido.push(`${p.quantidade_sobremesa}x Sobremesa ${p.sobremesa}`);
            totalItens += p.quantidade_sobremesa;
        }
        if (p.quantidade_adicional > 0 && p.adicional) {
            itensAdicionais.push(`${p.quantidade_adicional}x ${p.adicional}`);
            totalItens += p.quantidade_adicional;
        }
        valorTotal += p.preco_total;
    });
    // Exibe todos os itens como um único pedido
    if (itensPedido.length > 0) {
        recibo += `Pedido: ${itensPedido.join(" + ")}\n`;
    }
    // Exibe os adicionais separadamente após o pedido
    if (itensAdicionais.length > 0) {
        recibo += `Adicionais: ${itensAdicionais.join(" + ")}\n`;
    }
    const ultimo = pedidos[pedidos.length - 1];
    if (ultimo) {
        recibo += `
OBSERVAÇÕES: ${ultimo.observacoes}
FORMA DE PAGAMENTO: ${ultimo.forma_pagamento}
CUPOM: ${ultimo.cupom}
VALOR TOTAL: R$ ${valorTotal.toFixed(2)}
`;
    }
    recibo += `\nTOTAL DE ITENS: ${totalItens}`;
    return recibo;
}
// Cria e baixa arquivo
function baixarArquivo(nome, conteudo, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nome;
    a.click();
    URL.revokeObjectURL(url);
}
// Envia pedido e gera arquivos
btnEnviar.addEventListener("click", () => {
    if (pedidos.length === 0) {
        alert("Adicione pelo menos um item ao pedido!");
        return;
    }
    const cliente = {
        cliente_id: `${inputCPF.value.trim()}-${Date.now()}`, // exemplo de ID único
        cpf: inputCPF.value.trim(),
        nome: inputNome.value.trim(),
        telefone: inputTelefone.value.trim(),
        endereco: inputEndereco.value.trim(),
    };
    const cpfValido = /^\d{11}$/.test(cliente.cpf);
    const nomeValido = /^[A-Za-zÀ-ÿ\s]{3,}$/.test(cliente.nome);
    const telefoneValido = /^\d+$/.test(cliente.telefone);
    if (!cpfValido) {
        alert("CPF inválido! Deve conter exatamente 11 números, sem pontuações ou espaços.");
        return;
    }
    if (!nomeValido) {
        alert("Nome inválido! Deve conter no mínimo 3 letras e apenas letras.");
        return;
    }
    if (!telefoneValido) {
        alert("Telefone inválido! Deve conter apenas números.");
        return;
    }
    // Gera recibo e CSV
    const csv = gerarCSV(cliente, pedidos);
    const recibo = gerarRecibo(cliente, pedidos);
    baixarArquivo("recibo.txt", recibo, "text/plain");
    console.log("CSV armazenado internamente:\n", csv);
    // Envia para o backend
    console.log("Enviando para backend:", JSON.stringify({ cliente, pedidos }, null, 2));
    fetch("http://localhost:3000/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, pedidos }),
    })
        .then((res) => res.json())
        .then((data) => {
        alert(data.message || "Pedido enviado com sucesso!");
        pedidos.length = 0;
        blocoNotas.innerHTML = "";
    })
        .catch((err) => {
        console.error("Erro ao enviar pedido:", err);
        alert("Erro ao enviar pedido.");
    });
    // Limpa todos os campos após envio
    inputCPF.value = "";
    inputNome.value = "";
    inputTelefone.value = "";
    inputEndereco.value = "";
    inputPagamento.value = "";
    inputObservacoes.value = "";
    inputCupom.value = "";
    sabor.selectedIndex = 0;
    tamanho.selectedIndex = 0;
    qtdPizza.value = "1";
    bebida.selectedIndex = 0;
    qtdBebida.value = "1";
    sobremesa.selectedIndex = 0;
    qtdSobremesa.value = "1";
    adicional.selectedIndex = 0;
    qtdAdicional.value = "1";
    blocoNotas.innerHTML = "";
    valorTotal.innerHTML = "";
});
export {};
//# sourceMappingURL=pedido.js.map