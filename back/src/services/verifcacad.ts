// Define o tipo Cliente
type Cliente = {
  cpf: string;
  nome: string;
  telefone: string;
  endereco?: string; // opcional
  senha: string;
};

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  // Botões da tela
  const btnCadastrar = document.getElementById("btnCadastrar") as HTMLButtonElement;
  const btnCadastro = document.getElementById("btnCadastro") as HTMLButtonElement;

  // Função utilitária para capturar dados do formulário
  function getFormData(): Cliente {
    return {
      cpf: (document.getElementById("cpf") as HTMLInputElement).value.trim(),
      nome: (document.getElementById("nome") as HTMLInputElement).value.trim(),
      telefone: (document.getElementById("telefone") as HTMLInputElement).value.trim(),
      endereco: (document.getElementById("endereco") as HTMLInputElement).value.trim(),
      senha: (document.getElementById("senha") as HTMLInputElement).value.trim()
    };
  }

  // Função de validação dos campos obrigatórios
function validarCampos(dados: Cliente): string | null {
  // Verifica CPF (não vazio e apenas números com 11 dígitos)
  if (!dados.cpf || !/^\d{11}$/.test(dados.cpf)) {
    return "CPF inválido. Informe 11 dígitos numéricos.";
  }

  // Verifica Nome (não vazio e mínimo de 3 caracteres)
  if (!dados.nome || dados.nome.length < 3) {
    return "Nome inválido. Informe pelo menos 3 caracteres.";
  }

  // Verifica Telefone (não vazio e apenas números com 10 ou 11 dígitos)
  if (!dados.telefone || !/^\d{10,11}$/.test(dados.telefone)) {
    return "Telefone inválido. Informe 10 ou 11 dígitos numéricos.";
  }

  return null; // se tudo estiver ok
}

  // -----------------------------
  // Cadastro normal de cliente
  // -----------------------------
btnCadastrar.addEventListener("click", async () => {
  const dados = getFormData();

  // Validação
  const erro = validarCampos(dados);
  if (erro) {
    alert(erro);
    return; // interrompe se houver erro
  }

  // Faz requisição POST para a rota /clientes
  const res = await fetch("http://localhost:3000/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  const msg = await res.json();
  alert(msg.message || msg.error);
});

  // -----------------------------
  // Verificação + autocompletar
  // -----------------------------
btnCadastro.addEventListener("click", async () => {
  const dados = getFormData();

  // Validação
  const erro = validarCampos(dados);
  if (erro) {
    alert(erro);
    return;
  }

  // Faz requisição POST para a rota /verificar
  const res = await fetch("http://localhost:3000/verificar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  const msg = await res.json();
  alert(msg.message || msg.error);

  if (msg.clienteBanco && !msg.error) {
    (document.getElementById("nome") as HTMLInputElement).value = msg.clienteBanco.nome;
    (document.getElementById("telefone") as HTMLInputElement).value = msg.clienteBanco.telefone;
    (document.getElementById("endereco") as HTMLInputElement).value = msg.clienteBanco.endereco;
  }
});

});