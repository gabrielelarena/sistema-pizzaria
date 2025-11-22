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
  const btnCadastro = document.getElementById("btnCadastro") as HTMLButtonButtonElement;

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

  // Função de validação
  function validarCampos(dados: Cliente): string | null {
    // CPF → apenas números e exatamente 11 dígitos
    if (!/^\d{11}$/.test(dados.cpf)) {
      return "O CPF deve conter exatamente 11 números.";
    }

    // Nome → somente letras (incluindo acentos) + espaços
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(dados.nome)) {
      return "O nome deve conter apenas letras.";
    }

    // Telefone → pelo menos 8 números
    if (!/^\d{8,}$/.test(dados.telefone)) {
      return "O telefone deve conter pelo menos 8 números.";
    }

    return null; // tudo certo
  }

  // -----------------------------
  // Cadastro normal de cliente
  // -----------------------------
  btnCadastrar.addEventListener("click", async () => {
    const dados = getFormData();

    // validação antes do fetch
    const erro = validarCampos(dados);
    if (erro) {
      alert(erro);
      return;
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

    // validação antes de verificar
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

    // Se CPF + senha forem válidos, preenche automaticamente os campos
    if (msg.clienteBanco && !msg.error) {
      (document.getElementById("nome") as HTMLInputElement).value = msg.clienteBanco.nome;
      (document.getElementById("telefone") as HTMLInputElement).value = msg.clienteBanco.telefone;
      (document.getElementById("endereco") as HTMLInputElement).value = msg.clienteBanco.endereco;
    }
  });
});
