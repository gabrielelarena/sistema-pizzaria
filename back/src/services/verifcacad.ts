
type Cliente = {
  cpf: string;
  nome: string;
  telefone: string;
  endereco?: string;
  senha: string;
};

document.addEventListener("DOMContentLoaded", () => {
  const btnCadastrar = document.getElementById("btnCadastrar") as HTMLButtonElement;
  const btnCadastro = document.getElementById("btnCadastro") as HTMLButtonElement;

  function getFormData(): Cliente {
    return {
      cpf: (document.getElementById("cpf") as HTMLInputElement).value.trim(),
      nome: (document.getElementById("nome") as HTMLInputElement).value.trim(),
      telefone: (document.getElementById("telefone") as HTMLInputElement).value.trim(),
      endereco: (document.getElementById("endereco") as HTMLInputElement).value.trim(),
      senha: (document.getElementById("senha") as HTMLInputElement).value.trim()
    };
  }

  // Cadastro normal
  btnCadastrar.addEventListener("click", async () => {
    const dados = getFormData();
    const res = await fetch("http://localhost:3000/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const msg = await res.json();
    alert(msg.message || msg.error);
  });

  // Verificação + autocompletar
  btnCadastro.addEventListener("click", async () => {
    const dados = getFormData();
    const res = await fetch("http://localhost:3000/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const msg = await res.json();

    // Mostra mensagem de sucesso ou erro
    alert(msg.message || msg.error);

    // Só autocompleta se CPF + senha forem válidos
    if (msg.clienteBanco && !msg.error) {
      (document.getElementById("nome") as HTMLInputElement).value = msg.clienteBanco.nome;
      (document.getElementById("telefone") as HTMLInputElement).value = msg.clienteBanco.telefone;
      (document.getElementById("endereco") as HTMLInputElement).value = msg.clienteBanco.endereco;
    }
  });
});
