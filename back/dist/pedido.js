// Campos de seleção de pedido
const sabor = document.getElementById("Sabor");
const tamanho = document.getElementById("tamanho");
const qtdPizza = document.getElementById("quantidade_pizza");
const bebida = document.getElementById("bebida");
const qtdBebida = document.getElementById("quantidade_bebida");
const sobremesa = document.getElementById("sobremesa");
const qtdSobremesa = document.getElementById("quantidade_sobremesa");
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
    const pizzaSelecionada = sabor.selectedIndex > 0;
    const bebidaSelecionada = bebida.selectedIndex > 0;
    const sobremesaSelecionada = sobremesa.selectedIndex > 0;
    if (!pizzaSelecionada && !bebidaSelecionada && !sobremesaSelecionada) {
        alert("Selecione pelo menos uma pizza, bebida ou sobremesa.");
        return;
    }
    const cpf = inputCPF.value.trim();
    const nome = inputNome.value.trim();
    const telefone = inputTelefone.value.trim();
    // const endereco = inputEndereco.value.trim();
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
        pizza: pizzaSelecionada ? sabor.options[sabor.selectedIndex].text : "",
        tamanho: pizzaSelecionada ? tamanho.options[tamanho.selectedIndex].text : "",
        quantidadePizza: pizzaSelecionada ? Number(qtdPizza.value) : 0,
        bebida: bebidaSelecionada ? bebida.options[bebida.selectedIndex].text : "",
        quantidadeBebida: bebidaSelecionada ? Number(qtdBebida.value) : 0,
        sobremesa: sobremesaSelecionada ? sobremesa.options[sobremesa.selectedIndex].text : "",
        quantidadeSobremesa: sobremesaSelecionada ? Number(qtdSobremesa.value) : 0,
        observacoes: inputObservacoes.value.trim(),
        forma_pagamento: pagamento,
        preco_total: 0, // pode ser calculado depois
        cupom: inputCupom.value.trim()
    };
    pedidos.push(novoPedido);
    atualizarBlocoNotas();
});
// Atualiza visualmente o bloco de notas
function atualizarBlocoNotas() {
    blocoNotas.innerHTML = "";
    pedidos.forEach((p) => {
        let texto = `<p><strong>Pedido:</strong> `;
        const partes = [];
        if (p.quantidadePizza > 0 && p.pizza) {
            partes.push(`${p.quantidadePizza}x Pizza ${p.pizza} (${p.tamanho})`);
        }
        if (p.quantidadeBebida > 0 && p.bebida) {
            partes.push(`${p.quantidadeBebida}x ${p.bebida}`);
        }
        if (p.quantidadeSobremesa > 0 && p.sobremesa) {
            partes.push(`${p.quantidadeSobremesa}x Sobremesa ${p.sobremesa}`);
        }
        texto += partes.join(" + ") + "</p>";
        blocoNotas.innerHTML += texto;
        // Limpa os campos de seleção após adicionar ao bloco de notas
        sabor.selectedIndex = 0;
        tamanho.selectedIndex = 0;
        qtdPizza.value = "1";
        bebida.selectedIndex = 0;
        qtdBebida.value = "1";
        sobremesa.selectedIndex = 0;
        qtdSobremesa.value = "1";
    });
}
// Gera conteúdo CSV com cliente + pedidos
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
    const headerPedido = "Pizza,Tamanho,QuantidadePizza,Bebida,QuantidadeBebida,Sobremesa,QuantidadeSobremesa,Observações,FormaPagamento,PreçoTotal,Cupom";
    const linhasPedido = pedidos.map(p => `${p.pizza},${p.tamanho},${p.quantidadePizza},${p.bebida},${p.quantidadeBebida},${p.sobremesa},${p.quantidadeSobremesa},${p.observacoes},${p.forma_pagamento},${p.preco_total},${p.cupom}`);
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
    pedidos.forEach((p) => {
        const partes = [];
        if (p.quantidadePizza > 0 && p.pizza) {
            partes.push(`${p.quantidadePizza}x Pizza ${p.pizza} (${p.tamanho})`);
            totalItens += p.quantidadePizza;
        }
        if (p.quantidadeBebida > 0 && p.bebida) {
            partes.push(`${p.quantidadeBebida}x ${p.bebida}`);
            totalItens += p.quantidadeBebida;
        }
        if (p.quantidadeSobremesa > 0 && p.sobremesa) {
            partes.push(`${p.quantidadeSobremesa}x Sobremesa ${p.sobremesa}`);
            totalItens += p.quantidadeSobremesa;
        }
        if (partes.length > 0) {
            recibo += `Pedido: ${partes.join(" + ")}\n`;
        }
        valorTotal += p.preco_total;
    });
    const ultimo = pedidos[pedidos.length - 1];
    if (ultimo) {
        recibo += `
FORMA DE PAGAMENTO: ${ultimo.forma_pagamento}
OBSERVAÇÕES: ${ultimo.observacoes}
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
});
export {};
//# sourceMappingURL=pedido.js.map