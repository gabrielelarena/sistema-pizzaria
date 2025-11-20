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

  // -----------------------------
  // Cadastro normal de cliente
  // -----------------------------
  btnCadastrar.addEventListener("click", async () => {
    const dados = getFormData(); // pega dados do formulário

    // Faz requisição POST para a rota /clientes
    const res = await fetch("http://localhost:3000/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const msg = await res.json();
    alert(msg.message || msg.error); // mostra mensagem de sucesso ou erro
  });

  // -----------------------------
  // Verificação + autocompletar
  // -----------------------------
  btnCadastro.addEventListener("click", async () => {
    const dados = getFormData();

    // Faz requisição POST para a rota /verificar
    const res = await fetch("http://localhost:3000/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const msg = await res.json();

    // Mostra mensagem de sucesso ou erro
    alert(msg.message || msg.error);

    // Se CPF + senha forem válidos, preenche automaticamente os campos
    if (msg.clienteBanco && !msg.error) {
      (document.getElementById("nome") as HTMLInputElement).value = msg.clienteBanco.nome;
      (document.getElementById("telefone") as HTMLInputElement).value = msg.clienteBanco.telefone;
      (document.getElementById("endereco") as HTMLInputElement).value = msg.clienteBanco.endereco;
    }
  });
});