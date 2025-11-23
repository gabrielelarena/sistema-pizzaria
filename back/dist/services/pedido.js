var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const inputSenha = document.getElementById("senha");
// Campos adicionais
const inputObservacoes = document.getElementById("observacoes");
const inputCupom = document.getElementById("cupom");
// Elementos de controle
const blocoNotas = document.getElementById("blocoNotas");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnEnviar = document.getElementById("btnEnviar");
const btnValidarCupom = document.getElementById("btnValidarCupom");
// Controle de frete e lista de pedidos
let freteGratis = false;
const pedidos = [];
// -----------------------------
// Botão "Adicionar Pedido"
// -----------------------------
btnAdicionar.addEventListener("click", () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    // Verifica se ao menos um item foi selecionado
    const pizzaSelecionada = sabor.selectedIndex > 0;
    const bebidaSelecionada = bebida.selectedIndex > 0;
    const sobremesaSelecionada = sobremesa.selectedIndex > 0;
    const adicionalSelecionado = adicional.selectedIndex > 0;
    if (!pizzaSelecionada && !bebidaSelecionada && !sobremesaSelecionada && !adicionalSelecionado) {
        alert("Selecione pelo menos uma pizza, bebida, sobremesa ou adicional.");
        return;
    }
    // Captura dados do cliente
    const cpf = inputCPF.value.trim();
    const pagamento = inputPagamento.value.trim();
    if (!pagamento) {
        alert("Preencha o campo Forma de Pagamento também!");
        return;
    }
    // Data e hora do pedido
    const dataAtual = new Date();
    const data_pedido = `${dataAtual.toLocaleDateString("pt-BR")} - ${dataAtual.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })}`;
    // Monta objeto Pedido
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
        preco_total: 0, // calculado depois
        cupom: inputCupom.value.trim()
    };
    // Chama API para calcular preço
    fetch("http://localhost:3000/calcular-preco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPedido)
    })
        .then((res) => res.json())
        .then((data) => {
        novoPedido.preco_total = data.preco_total; // atualiza preço
        pedidos.push(novoPedido); // adiciona à lista
        atualizarBlocoNotas(); // atualiza visualmente
    })
        .catch((err) => {
        console.error("Erro ao calcular preço:", err);
        alert("Erro ao calcular preço do pedido.");
    });
});
// -----------------------------
// Atualiza visualmente o bloco de notas
// -----------------------------
function atualizarBlocoNotas() {
    blocoNotas.innerHTML = "";
    let valorTotalGeral = 0;
    // Percorre pedidos e cacula os valores
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
        // Monta HTML do pedido
        const pedidoHTML = `
      <div class="pedido-bloco" style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
        <p><strong>Pedido ${index + 1}:</strong> ${partes.join(" + ")}</p>
        <p><strong>Valor do pedido:</strong> R$ ${p.preco_total.toFixed(2)}</p>
      </div>
    `;
        blocoNotas.innerHTML += pedidoHTML;
    });
    // Calcula frete
    let valorFrete = 0;
    if (inputEndereco.value.trim() !== "" && !freteGratis) {
        valorFrete = 5;
        blocoNotas.innerHTML += `<p><strong>Frete:</strong> R$ 5,00</p>`;
    }
    else if (inputEndereco.value.trim() !== "" && freteGratis) {
        blocoNotas.innerHTML += `<p><strong>Frete:</strong> GRÁTIS</p>`;
    }
    // Atualiza total geral
    valorTotal.textContent = `Total: R$ ${(valorTotalGeral + valorFrete).toFixed(2)}`;
    // Reseta campos de seleção para novo pedido
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
// Função para limpar o bloco de notas
function limparBlocoNotas() {
    blocoNotas.innerHTML = "";
    valorTotal.textContent = "Total: R$ 0,00";
    pedidos.length = 0; // garante que os pedidos antigos não voltem
}
// Adiciona evento ao botão
const btnLimpar = document.getElementById("btnLimpar");
if (btnLimpar) {
    btnLimpar.addEventListener("click", limparBlocoNotas);
}
function gerarRecibo(cliente, pedidos, pagamento, frete) {
    const agora = new Date();
    // Data e hora formatadas para o recibo
    const data_pedido = `${agora.toLocaleDateString("pt-BR")} - ${agora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })}`;
    // Se não houver endereço, assume "Retirar no local"
    const enderecoFinal = cliente.endereco.trim() === "" ? "Retirar no local" : cliente.endereco;
    // Cabeçalho do recibo com dados do cliente
    let recibo = `🧾 ------------- RECIBO DO PEDIDO -------------

DATA: ${data_pedido}
CLIENTE: ${cliente.nome}
CPF: ${cliente.cpf}
TELEFONE: ${cliente.telefone}
ENDEREÇO: ${enderecoFinal}

`;
    let totalItens = 0; // contador de itens
    let valorTotal = 0; // soma dos valores
    const itensPedido = []; // lista de pizzas, bebidas e sobremesas
    const itensAdicionais = []; // lista de adicionais
    // Percorre todos os pedidos e monta lista de itens
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
        valorTotal += p.preco_total; // soma valor do pedido
    });
    // Adiciona itens ao recibo
    if (itensPedido.length > 0) {
        recibo += `Pedido: ${itensPedido.join(" + ")}\n`;
    }
    if (itensAdicionais.length > 0) {
        recibo += `Adicionais: ${itensAdicionais.join(" + ")}\n`;
    }
    // Usa último pedido para observações, forma de pagamento e cupom
    const ultimo = pedidos[pedidos.length - 1];
    if (ultimo) {
        recibo += `
OBSERVAÇÕES: ${ultimo.observacoes || "Nenhuma"}
FORMA DE PAGAMENTO: ${pagamento}
CUPOM: ${(ultimo === null || ultimo === void 0 ? void 0 : ultimo.cupom) || "Nenhum"}
FRETE: R$ ${frete.toFixed(2)}
VALOR TOTAL: R$ ${(valorTotal + frete).toFixed(2)}
`;
    }
    // Adiciona total de itens ao final
    recibo += `\nTOTAL DE ITENS: ${totalItens}`;
    return recibo;
}
function gerarCSV(cliente, pedidos, frete) {
    const ultimo = pedidos[pedidos.length - 1];
    // Cabeçalho com dados do cliente
    let csv = "---------- SEU PEDIDO ----------\n";
    csv += `CPF,${cliente.cpf}\n`;
    csv += `Nome,${cliente.nome}\n`;
    csv += `Telefone,${cliente.telefone}\n`;
    csv += `Endereço,${cliente.endereco.trim() !== "" ? cliente.endereco : "Retirar no local"}\n\n`;
    // Cabeçalho da tabela de itens
    csv += "Item,Quantidade,Valor\n";
    let total = 0;
    // Percorre pedidos e adiciona linhas
    pedidos.forEach(p => {
        if (p.quantidade_pizza > 0) {
            csv += `Pizza ${p.pizza} (${p.tamanho}),${p.quantidade_pizza},${p.preco_total.toFixed(2)}\n`;
        }
        if (p.quantidade_bebida > 0) {
            csv += `${p.bebida},${p.quantidade_bebida},\n`;
        }
        if (p.quantidade_sobremesa > 0) {
            csv += `Sobremesa ${p.sobremesa},${p.quantidade_sobremesa},\n`;
        }
        if (p.quantidade_adicional > 0) {
            csv += `Adicional ${p.adicional},${p.quantidade_adicional},\n`;
        }
        total += p.preco_total; // soma valor do pedido
    });
    // Observações e forma de pagamento do último pedido
    if (ultimo) {
        csv += `\nObservações,${ultimo.observacoes || "Nenhuma"}\n`;
        csv += `Forma de pagamento,${ultimo.forma_pagamento}\n`;
        csv += `Cupom,${ultimo.cupom || "Nenhum"}\n`;
    }
    // Frete e total
    csv += `Frete,,${frete.toFixed(2)}\n`;
    csv += `TOTAL,,${(total + frete).toFixed(2)}\n`;
    return csv;
}
// Cria e baixa arquivo
function baixarArquivo(nome, conteudo, tipo) {
    // Cria um Blob com o conteúdo e o MIME type informado (ex.: "text/plain")
    const blob = new Blob([conteudo], { type: tipo });
    // Cria uma URL temporária apontando para o Blob
    const url = URL.createObjectURL(blob);
    // Cria um elemento <a> dinamicamente para disparar o download
    const a = document.createElement("a");
    // Aponta o link para a URL do Blob
    a.href = url;
    // Define o nome do arquivo que será baixado
    a.download = nome;
    // Dispara o clique programaticamente para iniciar o download
    a.click();
    // Libera a URL temporária para evitar vazamento de memória
    URL.revokeObjectURL(url);
}
btnValidarCupom.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    // Se não houver pedidos, não há o que validar
    if (pedidos.length === 0) {
        alert("Nenhum pedido encontrado para validar cupons.");
        return;
    }
    // Obtém o último pedido (o mais recente). O operador ! informa ao TS que não é undefined
    const ultimo = pedidos[pedidos.length - 1];
    // Normaliza o cupom: remove espaços, transforma em maiúsculas
    const cupom = inputCupom.value.trim().toUpperCase();
    // Flag para aplicar feedback visual (válido/inválido)
    let valido = false;
    // Se o campo estiver vazio, apenas limpa o cupom do pedido e avisa
    if (!cupom) {
        ultimo.cupom = "";
        alert("Nenhum cupom informado.");
        return;
    }
    // Valida os diferentes tipos de cupom disponíveis
    switch (cupom) {
        case "PRIMEIRACOMPRA": {
            // Registra no console o CPF consultado
            console.log("Verificando cliente com CPF:", ultimo.cpf);
            // Consulta ao backend se já existe pedido para este CPF
            const res = yield fetch(`http://localhost:3000/verificar-cliente/${encodeURIComponent(ultimo.cpf)}`, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });
            // Se a resposta HTTP não for OK (status 200–299), informa erro
            if (!res.ok) {
                console.error("Resposta não OK:", res.status, res.statusText);
                alert("Erro ao verificar CPF. Tente novamente.");
                break;
            }
            // Lê a resposta como JSON
            const data = yield res.json();
            console.log("Resultado verificação:", data);
            // Cupom válido se o cliente ainda não tem pedidos (primeira compra)
            if (!data.temPedido) {
                freteGratis = true;
                alert("Cupom válido: FRETE GRÁTIS!");
                valido = true;
                ultimo.cupom = cupom; // <-- registra no pedido
            }
            else {
                alert("Cupom inválido: já existe pedido com este CPF.");
            }
            break;
        }
        case "CONTO20":
            // Soma a quantidade de pizzas de todos os pedidos criados na sessão atual
            const totalPizzas = pedidos.reduce((acc, p) => acc + p.quantidade_pizza, 0);
            // Regras: 3 ou mais pizzas no total para aplicar 20% de desconto nas pizzas
            if (totalPizzas >= 3) {
                pedidos.forEach(p => {
                    const desconto = p.quantidade_pizza > 0 ? p.preco_total * 0.2 : 0;
                    p.preco_total -= desconto;
                });
                alert("Cupom válido: 20% de desconto aplicado nas pizzas!");
                valido = true;
                ultimo.cupom = cupom; // <-- registra
            }
            break;
        case "PUDIMZIM":
            // Soma o valor de todos os pedidos já adicionados (após cálculos de preço)
            const totalPedidos = pedidos.reduce((acc, p) => acc + p.preco_total, 0);
            // Se gasto total for maior que R$100, concede pudim grátis
            if (totalPedidos > 100) {
                alert("Cupom válido: você ganhou um pudim!");
                valido = true;
                ultimo.cupom = cupom; // <-- registra
                blocoNotas.innerHTML += `<p><strong>Promoção:</strong> Pudim grátis incluído</p>`;
            }
            break;
        case "COKEBOM":
            // Verifica se há pedidos da mesma pizza com tamanhos M e G
            const temGrande = pedidos.some(p => p.pizza === ultimo.pizza && p.tamanho.includes("G"));
            const temMedia = pedidos.some(p => p.pizza === ultimo.pizza && p.tamanho.includes("M"));
            // Regra: se o último pedido for M e existe G do mesmo sabor, ou último for G e existe M do mesmo sabor
            if ((temGrande && ultimo.tamanho.includes("M")) || (temMedia && ultimo.tamanho.includes("G"))) {
                alert("Cupom válido: ganhou uma Coca 2L!");
                valido = true;
                ultimo.cupom = cupom; // <-- registra
            }
            break;
        default:
            // Qualquer outro código não é reconhecido
            alert("Cupom inválido, corrija antes de enviar.");
            ultimo.cupom = ""; // limpa o cupom do pedido
    }
    // Atualiza o feedback visual no input do cupom (classes Bootstrap)
    inputCupom.classList.remove("is-valid", "is-invalid");
    if (cupom !== "") {
        inputCupom.classList.add(valido ? "is-valid" : "is-invalid");
    }
    // Re-renderiza o bloco de notas para refletir descontos / promoções
    atualizarBlocoNotas();
}));
inputCupom.addEventListener("input", () => {
    // Toda vez que o usuário digitar, se ficar vazio, remove feedback
    if (inputCupom.value.trim() === "") {
        inputCupom.classList.remove("is-valid", "is-invalid");
        // Se existir pelo menos um pedido, limpa o cupom do último
        if (pedidos.length > 0) {
            pedidos[pedidos.length - 1].cupom = "";
        }
    }
});
// Envia pedido e gera arquivos
btnEnviar.addEventListener("click", () => {
    // Não permite enviar sem ao menos um item
    if (pedidos.length === 0) {
        alert("Adicione pelo menos um item ao pedido!");
        return;
    }
    // Bloqueia envio se o cupom estiver marcado como inválido
    if (inputCupom.classList.contains("is-invalid")) {
        alert("Cupom inválido, corrija antes de enviar.");
        return;
    }
    // Normaliza texto da forma de pagamento: minúsculas, sem acentos
    let pagamentoNormalizado = inputPagamento.value
        .trim()
        .toLowerCase()
        .normalize("NFD") // separa acentos
        .replace(/[\u0300-\u036f]/g, ""); // remove diacríticos
    // Lista de formas de pagamento aceitas já normalizadas
    const formasValidas = ["pix", "credito", "debito", "dinheiro"];
    // Validação da forma de pagamento
    if (!formasValidas.includes(pagamentoNormalizado)) {
        alert("Forma de pagamento inválida! Use Pix, Crédito, Débito ou Dinheiro.");
        return;
    }
    // Converte para a grafia correta para exibição/armazenamento
    switch (pagamentoNormalizado) {
        case "pix":
            pagamentoNormalizado = "Pix";
            break;
        case "credito":
            pagamentoNormalizado = "Crédito";
            break;
        case "debito":
            pagamentoNormalizado = "Débito";
            break;
        case "dinheiro":
            pagamentoNormalizado = "Dinheiro";
            break;
    }
    // Monta objeto do cliente a partir dos campos do formulário
    const cliente = {
        cliente_id: `${inputCPF.value.trim()}-${Date.now()}`, // ID único composto por CPF + timestamp
        cpf: inputCPF.value.trim(),
        nome: inputNome.value.trim(),
        telefone: inputTelefone.value.trim(),
        endereco: inputEndereco.value.trim(),
    };
    // Atualiza todos os pedidos com a forma de pagamento normalizada
    pedidos.forEach(p => p.forma_pagamento = pagamentoNormalizado);
    // Calcula frete: grátis se freteGratis; senão, R$5 se houver endereço (entrega)
    const valorFrete = freteGratis ? 0 : (inputEndereco.value.trim() !== "" ? 5 : 0);
    // Gera o recibo (texto) e o CSV (string) considerando o frete calculado
    const recibo = gerarRecibo(cliente, pedidos, pagamentoNormalizado, valorFrete);
    const csv = gerarCSV(cliente, pedidos, valorFrete);
    // Faz download automático do recibo como .txt
    baixarArquivo("recibo.txt", recibo, "text/plain");
    // Opcional: mantém uma cópia do CSV no console (pode usar baixarArquivo para salvar também)
    console.log("CSV armazenado internamente:\n", csv);
    // Envia o pedido completo para o backend, incluindo cliente e lista de pedidos
    fetch("http://localhost:3000/enviar-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente, pedidos }),
    })
        .then((res) => res.json())
        .then((data) => {
        // Exibe mensagem retornada (ou padrão de sucesso)
        alert(data.message || "Pedido enviado com sucesso!");
        // Limpa o array de pedidos (zera a sessão local)
        pedidos.length = 0;
        // Limpa o bloco visual dos pedidos
        blocoNotas.innerHTML = "";
    })
        .catch((err) => {
        console.error("Erro ao enviar pedido:", err);
        alert("Erro ao enviar pedido.");
    });
    // Limpa todos os campos do formulário após o envio
    inputCPF.value = "";
    inputNome.value = "";
    inputTelefone.value = "";
    inputEndereco.value = "";
    inputPagamento.value = "";
    inputObservacoes.value = "";
    inputCupom.value = "";
    inputSenha.value = "";
    // Remove feedback visual do cupom e garante que o campo esteja habilitado
    inputCupom.classList.remove("is-valid", "is-invalid");
    inputCupom.disabled = false;
    // Reseta seletores e quantidades para valores padrão
    sabor.selectedIndex = 0;
    tamanho.selectedIndex = 0;
    qtdPizza.value = "1";
    bebida.selectedIndex = 0;
    qtdBebida.value = "1";
    sobremesa.selectedIndex = 0;
    qtdSobremesa.value = "1";
    adicional.selectedIndex = 0;
    qtdAdicional.value = "1";
    // Garante limpeza das áreas de saída visual
    blocoNotas.innerHTML = "";
    valorTotal.innerHTML = "";
});
export {};
//# sourceMappingURL=pedido.js.map