"use strict";
const sabor = document.getElementById("Sabor");
const tamanho = document.getElementById("Tamanho");
const qtdPizza = document.getElementById("quantidade_pizza");
const bebida = document.getElementById("Bebida");
const qtdBebida = document.getElementById("quantidade_bebida");
const blocoNotas = document.getElementById("blocoNotas");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnEnviar = document.getElementById("btnEnviar");
// Campos do cliente
const inputCPF = document.querySelector('input[aria-label="CPF"]');
const inputNome = document.querySelector('input[aria-label="First name"]');
const inputTelefone = document.querySelector('input[type="tel"]');
const inputEndereco = document.querySelector('input[placeholder^="Ex: Rua"]');
const inputPagamento = document.querySelector('input[placeholder^="Pix"]');
const pedidos = [];
let cliente = null;
// Adiciona pedido ao array
btnAdicionar.addEventListener("click", () => {
    const pizzaSelecionada = sabor.selectedIndex > 0;
    const bebidaSelecionada = bebida.selectedIndex > 0;
    if (!pizzaSelecionada && !bebidaSelecionada) {
        alert("Selecione pelo menos uma pizza ou uma bebida.");
        return;
    }
    // Captura os valores brutos
    const cpf = inputCPF.value.trim();
    const nome = inputNome.value.trim();
    const telefone = inputTelefone.value.trim();
    const endereco = inputEndereco.value.trim();
    const pagamento = inputPagamento.value.trim();
    // Validações
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
    if (!endereco || !pagamento) {
        alert("Preencha todos os dados do cliente!");
        return;
    }
    const novoPedido = {
        pizza: pizzaSelecionada ? sabor.options[sabor.selectedIndex].text : "",
        tamanho: pizzaSelecionada ? tamanho.options[tamanho.selectedIndex].text : "",
        quantidade_pizza: pizzaSelecionada ? Number(qtdPizza.value) : 0,
        bebida: bebidaSelecionada ? bebida.options[bebida.selectedIndex].text : "",
        quantidade_bebidaida: bebidaSelecionada ? Number(qtdBebida.value) : 0,
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
        if (p.quantidade_pizza > 0 && p.pizza) {
            partes.push(`${p.quantidade_pizza}x Pizza ${p.pizza} (${p.tamanho})`);
        }
        if (p.quantidade_bebidaida > 0 && p.bebida) {
            partes.push(`${p.quantidade_bebidaida}x ${p.bebida}`);
        }
        texto += partes.join(" + ") + "</p>";
        blocoNotas.innerHTML += texto;
    });
}
// Gera conteúdo CSV com cliente + pedidos
function gerarCSV(cliente, pedidos) {
    const headerCliente = "CPF,Nome,Telefone,Endereço,Pagamento";
    const dadosCliente = `${cliente.cpf},${cliente.nome},${cliente.telefone},${cliente.endereco},${cliente.pagamento}`;
    const headerPedido = "Pizza,Tamanho,quantidade_pizza,Bebida,quantidade_bebidaida";
    const linhasPedido = pedidos.map(p => `${p.pizza},${p.tamanho},${p.quantidade_pizza},${p.bebida},${p.quantidade_bebidaida}`);
    return [headerCliente, dadosCliente, "", headerPedido, ...linhasPedido].join("\n");
}
// Gera conteúdo TXT do recibo
function gerarRecibo(cliente, pedidos) {
    let recibo = `🧾 ------------- RECIBO DO PEDIDO -------------

CLIENTE: ${cliente.nome}
CPF: ${cliente.cpf}
TELEFONE: ${cliente.telefone}
ENDEREÇO: ${cliente.endereco}
PAGAMENTO: ${cliente.pagamento}

`;
    let totalItens = 0;
    pedidos.forEach((p, i) => {
        const partes = [];
        if (p.quantidade_pizza > 0 && p.pizza) {
            partes.push(`${p.quantidade_pizza}x Pizza ${p.pizza} (${p.tamanho})`);
            totalItens += p.quantidade_pizza;
        }
        if (p.quantidade_bebidaida > 0 && p.bebida) {
            partes.push(`${p.quantidade_bebidaida}x ${p.bebida}`);
            totalItens += p.quantidade_bebidaida;
        }
        if (partes.length > 0) {
            recibo += `Pedido ${i + 1}: ${partes.join(" + ")}\n`;
        }
    });
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
    cliente = {
        cpf: inputCPF.value.trim(),
        nome: inputNome.value.trim(),
        telefone: inputTelefone.value.trim(),
        endereco: inputEndereco.value.trim(),
        pagamento: inputPagamento.value.trim(),
    };
    if (!cliente.cpf || !cliente.nome || !cliente.telefone || !cliente.endereco || !cliente.pagamento) {
        alert("Preencha todos os dados do cliente!");
        return;
    }
    const csv = gerarCSV(cliente, pedidos);
    const recibo = gerarRecibo(cliente, pedidos);
    baixarArquivo("recibo.txt", recibo, "text/plain");
    // Simulação de armazenamento interno do CSV
    console.log("CSV armazenado internamente:\n", csv);
    alert("Pedido enviado com sucesso!");
    pedidos.length = 0;
    blocoNotas.innerHTML = "";
});
//# sourceMappingURL=pedido.js.map