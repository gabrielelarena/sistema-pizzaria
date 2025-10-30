const sabor = document.getElementById("Sabor") as HTMLSelectElement;
const tamanho = document.getElementById("tamanho") as HTMLSelectElement;
const qtdPizza = document.getElementById("quantidade_pizza") as HTMLInputElement;
const bebida = document.getElementById("bebida") as HTMLSelectElement;
const qtdBebida = document.getElementById("quantidade_bebida") as HTMLInputElement;
const blocoNotas = document.getElementById("blocoNotas") as HTMLDivElement;
const btnAdicionar = document.getElementById("btnAdicionar") as HTMLButtonElement;
const btnEnviar = document.getElementById("btnEnviar") as HTMLButtonElement;

// Campos do cliente
const inputCPF = document.querySelector('input[aria-label="CPF"]') as HTMLInputElement;
const inputNome = document.querySelector('input[aria-label="First name"]') as HTMLInputElement;
const inputTelefone = document.querySelector('input[type="tel"]') as HTMLInputElement;
const inputEndereco = document.querySelector('input[placeholder^="Ex: Rua"]') as HTMLInputElement;
const inputPagamento = document.querySelector('input[placeholder^="Pix"]') as HTMLInputElement;

interface Pedido {
  pizza: string;
  tamanho: string;
  quantidadePizza: number;
  bebida: string;
  quantidadeBebida: number;
  // cpf: string;
  data_pedido: string;
}

interface Cliente {
  cpf: string;
  nome: string;
  telefone: string;
  endereco: string;
  pagamento: string;
}

const pedidos: Pedido[] = [];
let cliente: Cliente | null = null;

// Adiciona pedido ao array
btnAdicionar.addEventListener("click", () => {
  const pizzaSelecionada = sabor.selectedIndex > 0;
  const bebidaSelecionada = bebida.selectedIndex > 0;
  const dataAtual = new Date().toISOString().split('T')[0];
  const campoData = document.getElementById("data_pedido") as HTMLInputElement;
  campoData.value = dataAtual; // atribui a data atual no campo hidden


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

  const data_pedido = new Date().toISOString().split('T')[0];

  const novoPedido: Pedido = {
  pizza: pizzaSelecionada ? sabor.options[sabor.selectedIndex].text : "",
  tamanho: pizzaSelecionada ? tamanho.options[tamanho.selectedIndex].text : "",
  quantidadePizza: pizzaSelecionada ? Number(qtdPizza.value) : 0,
  bebida: bebidaSelecionada ? bebida.options[bebida.selectedIndex].text : "",
  quantidadeBebida: bebidaSelecionada ? Number(qtdBebida.value) : 0,
  data_pedido: campoData.value // pega a data já atribuída
};


  pedidos.push(novoPedido);
  atualizarBlocoNotas();
});

// Atualiza visualmente o bloco de notas
function atualizarBlocoNotas() {
  blocoNotas.innerHTML = "";
  pedidos.forEach((p) => {
    let texto = `<p><strong>Pedido:</strong> `;
    const partes: string[] = [];

    if (p.quantidadePizza > 0 && p.pizza) {
      partes.push(`${p.quantidadePizza}x Pizza ${p.pizza} (${p.tamanho})`);
    }

    if (p.quantidadeBebida > 0 && p.bebida) {
      partes.push(`${p.quantidadeBebida}x ${p.bebida}`);
    }

    texto += partes.join(" + ") + "</p>";
    blocoNotas.innerHTML += texto;
  });
}

// Gera conteúdo CSV com cliente + pedidos
function gerarCSV(cliente: Cliente, pedidos: Pedido[]): string {
  const headerCliente = "CPF,Nome,Telefone,Endereço,Pagamento";
  const dadosCliente = `${cliente.cpf},${cliente.nome},${cliente.telefone},${cliente.endereco},${cliente.pagamento}`;

  const headerPedido = "Pizza,Tamanho,QuantidadePizza,Bebida,QuantidadeBebida,DataPedido";
  const linhasPedido = pedidos.map(p =>
    `${p.pizza},${p.tamanho},${p.quantidadePizza},${p.bebida},${p.quantidadeBebida},${p.data_pedido}`
  );

  return [headerCliente, dadosCliente, "", headerPedido, ...linhasPedido].join("\n");
}

// Gera conteúdo TXT do recibo
function gerarRecibo(cliente: Cliente, pedidos: Pedido[]): string {
  let recibo = `🧾 ------------- RECIBO DO PEDIDO -------------

CLIENTE: ${cliente.nome}
CPF: ${cliente.cpf}
TELEFONE: ${cliente.telefone}
ENDEREÇO: ${cliente.endereco}
PAGAMENTO: ${cliente.pagamento}

`;

  let totalItens = 0;

  pedidos.forEach((p, i) => {
    const partes: string[] = [];

    if (p.quantidadePizza > 0 && p.pizza) {
      partes.push(`${p.quantidadePizza}x Pizza ${p.pizza} (${p.tamanho})`);
      totalItens += p.quantidadePizza;
    }

    if (p.quantidadeBebida > 0 && p.bebida) {
      partes.push(`${p.quantidadeBebida}x ${p.bebida}`);
      totalItens += p.quantidadeBebida;
    }

    if (partes.length > 0) {
      recibo += `Pedido ${i + 1} (${p.data_pedido}): ${partes.join(" + ")}\n`;
    }
  });

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

  const cliente = {
    cpf: inputCPF.value.trim(),
    nome: inputNome.value.trim(),
    telefone: inputTelefone.value.trim(),
    endereco: inputEndereco.value.trim(),
    pagamento: inputPagamento.value.trim(),
  };

  // Validações 
  const cpfValido = /^\d{11}$/.test(cliente.cpf);
  const nomeValido = /^[A-Za-zÀ-ÿ\s]{3,}$/.test(cliente.nome);
  const telefoneValido = /^\d{8,15}$/.test(cliente.telefone);

  if (!cpfValido) {
    alert("CPF inválido! Deve conter exatamente 11 dígitos numéricos.");
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

  if (!cliente.endereco || !cliente.pagamento) {
    alert("Preencha todos os dados do cliente!");
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
});