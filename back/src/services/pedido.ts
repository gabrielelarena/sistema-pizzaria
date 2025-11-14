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
const valorTotal = document.getElementById("valorTotal") as HTMLElement;

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
const btnValidarCupom = document.getElementById("btnValidarCupom") as HTMLButtonElement;

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

let freteGratis = false;
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
    pizza: pizzaSelecionada ? sabor.options[sabor.selectedIndex]?.text ?? "" : "",
    tamanho: pizzaSelecionada ? tamanho.options[tamanho.selectedIndex]?.text ?? "" : "",
    quantidade_pizza: pizzaSelecionada ? Number(qtdPizza.value) : 0,
    bebida: bebidaSelecionada ? bebida.options[bebida.selectedIndex]?.text ?? "" : "",
    quantidade_bebida: bebidaSelecionada ? Number(qtdBebida.value) : 0,
    sobremesa: sobremesaSelecionada ? sobremesa.options[sobremesa.selectedIndex]?.text ?? "" : "",
    quantidade_sobremesa: sobremesaSelecionada ? Number(qtdSobremesa.value) : 0,
    adicional: adicionalSelecionado ? adicional.options[adicional.selectedIndex]?.text ?? "" : "",
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

  let valorFrete = 0;

  if (inputEndereco.value.trim() !== "" && !freteGratis) {
    valorFrete = 5;
    blocoNotas.innerHTML += `<p><strong>Frete:</strong> R$ 5,00</p>`;
  } else if (inputEndereco.value.trim() !== "" && freteGratis) {
    blocoNotas.innerHTML += `<p><strong>Frete:</strong> GRÁTIS</p>`;
  }

  valorTotal.textContent = `Total: R$ ${(valorTotalGeral + valorFrete).toFixed(2)}`;

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

function gerarRecibo(cliente: Cliente, pedidos: Pedido[], pagamento: string, frete: number): string {
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

  if (itensPedido.length > 0) {
    recibo += `Pedido: ${itensPedido.join(" + ")}\n`;
  }
  if (itensAdicionais.length > 0) {
    recibo += `Adicionais: ${itensAdicionais.join(" + ")}\n`;
  }

  const ultimo: Pedido | undefined = pedidos[pedidos.length - 1];
  if (ultimo) {
    recibo += `
OBSERVAÇÕES: ${ultimo.observacoes || "Nenhuma"}
FORMA DE PAGAMENTO: ${pagamento}
CUPOM: ${ultimo?.cupom || "Nenhum"}
FRETE: R$ ${frete.toFixed(2)}
VALOR TOTAL: R$ ${(valorTotal + frete).toFixed(2)}
`;
  }

  recibo += `\nTOTAL DE ITENS: ${totalItens}`;
  return recibo;
}

function gerarCSV(cliente: Cliente, pedidos: Pedido[], frete: number): string {
  const ultimo: Pedido | undefined = pedidos[pedidos.length - 1];

  let csv = "---------- SEU PEDIDO ----------\n";
  csv += `CPF,${cliente.cpf}\n`;
  csv += `Nome,${cliente.nome}\n`;
  csv += `Telefone,${cliente.telefone}\n`;
  csv += `Endereço,${cliente.endereco.trim() !== "" ? cliente.endereco : "Retirar no local"}\n\n`;

  csv += "Item,Quantidade,Valor\n";
  let total = 0;

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
    total += p.preco_total;
  });

  if (ultimo) {
    csv += `\nObservações,${ultimo.observacoes || "Nenhuma"}\n`;
    csv += `Forma de pagamento,${ultimo.forma_pagamento}\n`;
    csv += `Cupom,${ultimo.cupom || "Nenhum"}\n`;
  }

  csv += `Frete,,${frete.toFixed(2)}\n`;
  csv += `TOTAL,,${(total + frete).toFixed(2)}\n`;

  return csv;
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

btnValidarCupom.addEventListener("click", async () => {
  if (pedidos.length === 0) {
    alert("Nenhum pedido encontrado para validar cupons.");
    return;
  }

  // ✅ aqui o TS já sabe que não é undefined
  const ultimo: Pedido = pedidos[pedidos.length - 1]!;
  const cupom = inputCupom.value.trim().toUpperCase();
  let valido = false;

  if (!cupom) {
    // se não digitou nada, apenas limpa
    ultimo.cupom = "";
    alert("Nenhum cupom informado.");
    return;
  }

  switch (cupom) {
    case "PRIMEIRACOMPRA": {

      console.log("Verificando cliente com CPF:", ultimo.cpf);

      const res = await fetch(`http://localhost:3000/verificar-cliente/${encodeURIComponent(ultimo.cpf)}`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) {
        console.error("Resposta não OK:", res.status, res.statusText);
        alert("Erro ao verificar CPF. Tente novamente.");
        break;
      }

      const data = await res.json();
      console.log("Resultado verificação:", data);

      if (!data.existe) {
        freteGratis = true;
        alert("Cupom válido: FRETE GRÁTIS!");
        valido = true;
      } else {
        alert("Cupom inválido: já existe cliente com este CPF.");
      }
      break;
    }

    case "CONTO20":
      // soma todas as pizzas de todos os pedidos
      const totalPizzas = pedidos.reduce((acc, p) => acc + p.quantidade_pizza, 0);

      if (totalPizzas >= 3) {
        // aplica desconto apenas sobre os itens (sem frete)
        pedidos.forEach(p => {
          const desconto = p.quantidade_pizza > 0 ? p.preco_total * 0.2 : 0;
          p.preco_total -= desconto;
        });

        alert("Cupom válido: 20% de desconto aplicado nas pizzas!");
        valido = true;
      } else {
        alert("Cupom inválido: precisa de pelo menos 3 pizzas no total.");
      }
      break;


    case "PUDIMZIM":
      // soma o valor de todos os pedidos já adicionados
      const totalPedidos = pedidos.reduce((acc, p) => acc + p.preco_total, 0);

      if (totalPedidos > 100) {
        alert("Cupom válido: você ganhou um pudim!");
        valido = true;
        // aqui você pode marcar no bloco de notas que o pudim foi incluído
        blocoNotas.innerHTML += `<p><strong>Promoção:</strong> Pudim grátis incluído</p>`;
      } else {
        alert("Cupom inválido: só vale se gastar mais de R$100 no total da compra.");
      }
      break;

    case "COKEBOM":
      const temGrande = pedidos.some(p => p.pizza === ultimo.pizza && p.tamanho.includes("G"));
      const temMedia = pedidos.some(p => p.pizza === ultimo.pizza && p.tamanho.includes("M"));
      if ((temGrande && ultimo.tamanho.includes("M")) || (temMedia && ultimo.tamanho.includes("G"))) {
        alert("Cupom válido: ganhou uma Coca 2L!");
        valido = true;
      } else {
        alert("Cupom inválido: precisa pedir M e G do mesmo sabor.");
      }
      break;

    default:
      alert("Cupom inválido, corrija antes de enviar.");
      ultimo.cupom = ""; // 🔄 limpa se inválido
  }

  // Feedback visual simplificado
  inputCupom.classList.remove("is-valid", "is-invalid");
  if (cupom !== "") {
    inputCupom.classList.add(valido ? "is-valid" : "is-invalid");
  }

  atualizarBlocoNotas();
});

inputCupom.addEventListener("input", () => {
  if (inputCupom.value.trim() === "") {
    inputCupom.classList.remove("is-valid", "is-invalid");
    if (pedidos.length > 0) {
      pedidos[pedidos.length - 1]!.cupom = ""; // limpa cupom no objeto
    }
  }
});

// Envia pedido e gera arquivos
btnEnviar.addEventListener("click", () => {
  if (pedidos.length === 0) {
    alert("Adicione pelo menos um item ao pedido!");
    return;
  }

  if (inputCupom.classList.contains("is-invalid")) {
    alert("Cupom inválido, corrija antes de enviar.");
    return;
  }

  // Normaliza o texto do pagamento
  let pagamentoNormalizado = inputPagamento.value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const formasValidas = ["pix", "credito", "debito", "dinheiro"];

  if (!formasValidas.includes(pagamentoNormalizado)) {
    alert("Forma de pagamento inválida! Use Pix, Crédito, Débito ou Dinheiro.");
    return;
  }

  // Converte para forma correta para exibir
  switch (pagamentoNormalizado) {
    case "pix": pagamentoNormalizado = "Pix"; break;
    case "credito": pagamentoNormalizado = "Crédito"; break;
    case "debito": pagamentoNormalizado = "Débito"; break;
    case "dinheiro": pagamentoNormalizado = "Dinheiro"; break;
  }

  const cliente: Cliente = {
    cliente_id: `${inputCPF.value.trim()}-${Date.now()}`,
    cpf: inputCPF.value.trim(),
    nome: inputNome.value.trim(),
    telefone: inputTelefone.value.trim(),
    endereco: inputEndereco.value.trim(),
  };

  // 🔎 Atualiza todos os pedidos com o pagamento normalizado
  pedidos.forEach(p => p.forma_pagamento = pagamentoNormalizado);

  // Gera recibo e CSV usando o pagamento já normalizado
  // calcula frete separado
  const valorFrete = freteGratis ? 0 : (inputEndereco.value.trim() !== "" ? 5 : 0);

  // gera recibo e CSV com frete separado
  const recibo = gerarRecibo(cliente, pedidos, pagamentoNormalizado, valorFrete);
  const csv = gerarCSV(cliente, pedidos, valorFrete);

  baixarArquivo("recibo.txt", recibo, "text/plain");
  console.log("CSV armazenado internamente:\n", csv);


  // Envia para o backend com o pagamento correto
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

  // 🔄 remove feedback visual do cupom
  inputCupom.classList.remove("is-valid", "is-invalid");
  inputCupom.disabled = false; // reabilita o campo para novo cupom

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
