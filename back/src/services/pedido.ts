// Campos de seleção de pedido
const sabor = document.getElementById("Sabor") as HTMLSelectElement;
const tamanho = document.getElementById("tamanho") as HTMLSelectElement;
const qtdPizza = document.getElementById("quantidade_pizza") as HTMLInputElement;
const bebida = document.getElementById("bebida") as HTMLSelectElement;
const qtdBebida = document.getElementById("quantidade_bebida") as HTMLInputElement;
const sobremesa = document.getElementById("sobremesa") as HTMLSelectElement;
const qtdSobremesa = document.getElementById("quantidade_sobremesa") as HTMLInputElement;
const adicional = document.getElementById('adicional') as HTMLSelectElement;
const qtdAdicional = document.getElementById('quantidade_adicional') as HTMLInputElement;

// Campos de dados do cliente
const inputCPF = document.getElementById("cpf") as HTMLInputElement;
const inputNome = document.getElementById("nome") as HTMLInputElement;
const inputTelefone = document.getElementById("telefone") as HTMLInputElement;
const inputEndereco = document.getElementById("endereco") as HTMLInputElement;
const inputPagamento = document.getElementById("pagamento") as HTMLInputElement;

// Campos adicionais
const inputObservacoes = document.getElementById("observacoes") as HTMLInputElement;
const inputCupom = document.getElementById("cupom") as HTMLInputElement;

// Elementos de controle
const blocoNotas = document.getElementById("blocoNotas") as HTMLDivElement;
const btnAdicionar = document.getElementById("btnAdicionar") as HTMLButtonElement;
const btnEnviar = document.getElementById("btnEnviar") as HTMLButtonElement;

export interface Cliente {
  cliente_id: string;
  cpf: string;
  nome: string;
  telefone: string;
  endereco: string;
}

export interface Pedido {
  cpf: string;
  data_pedido: string;
  pizza: string;
  quantidade_pizza: number;
  tamanho: string;
  bebida: string;
  quantidade_bebida: number;
  sobremesa: string;
  quantidade_sobremesa: number;
  adicional: string;
  quantidade_adicional: number;
  observacoes: string;
  forma_pagamento: string;
  preco_total: number;
  cupom: string;
}


const pedidos: Pedido[] = [];

btnAdicionar.addEventListener("click", () => {
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

  const novoPedido: Pedido = {
    data_pedido,
    cpf,
    pizza: pizzaSelecionada ? sabor.options[sabor.selectedIndex].text : "",
    tamanho: pizzaSelecionada ? tamanho.options[tamanho.selectedIndex].text : "",
    quantidade_pizza: pizzaSelecionada ? Number(qtdPizza.value) : 0,
    bebida: bebidaSelecionada ? bebida.options[bebida.selectedIndex].text : "",
    quantidade_bebida: bebidaSelecionada ? Number(qtdBebida.value) : 0,
    sobremesa: sobremesaSelecionada ? sobremesa.options[sobremesa.selectedIndex].text : "",
    quantidade_sobremesa: sobremesaSelecionada ? Number(qtdSobremesa.value) : 0,
    adicional: adicionalSelecionado ? adicional.options[adicional.selectedIndex].text : "",
    quantidade_adicional: adicionalSelecionado ? Number(qtdAdicional.value) : 0,
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

    adicional.selectedIndex = 0;
    qtdAdicional.value = "1";

  });
}

function gerarCSV(cliente: Cliente, pedidos: Pedido[]): string {
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
  const linhasPedido = pedidos.map(p =>
    `${p.pizza},${p.tamanho},${p.quantidade_pizza},${p.bebida},${p.quantidade_bebida},${p.sobremesa},${p.quantidade_sobremesa},${p.adicional},${p.quantidade_adicional},${p.observacoes},${p.forma_pagamento},${p.preco_total},${p.cupom}`
  );

  return [
    `Data do Pedido: ${dataFormatada}`,
    headerCliente,
    dadosCliente,
    "",
    headerPedido,
    ...linhasPedido
  ].join("\n");
}


function gerarRecibo(cliente: Cliente, pedidos: Pedido[]): string {
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

  const itensPedido: string[] = [];
  const itensAdicionais: string[] = [];

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

  const ultimo: Pedido | undefined = pedidos[pedidos.length - 1];

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
function baixarArquivo(nome: string, conteudo: string, tipo: string) {
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

  const cliente: Cliente = {
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


});