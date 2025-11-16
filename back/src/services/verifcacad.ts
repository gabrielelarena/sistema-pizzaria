type Cliente = {
  cpf: string;
  nome: string;
  telefone: string;
  endereco?: string;
};

document.addEventListener("DOMContentLoaded", () => {
  const btnCadastrar = document.getElementById("btnCadastrar") as HTMLButtonElement;
  const btnCadastro = document.getElementById("btnCadastro") as HTMLButtonElement;

  function getFormData(): Cliente {
    return {
      cpf: (document.getElementById("cpf") as HTMLInputElement).value,
      nome: (document.getElementById("nome") as HTMLInputElement).value,
      telefone: (document.getElementById("telefone") as HTMLInputElement).value,
      endereco: (document.getElementById("endereco") as HTMLInputElement).value
    };
  }

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

  btnCadastro.addEventListener("click", async () => {
    const dados = getFormData();
    const res = await fetch("http://localhost:3000/verificar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const msg = await res.json();
    alert(msg.message || msg.error);

    if (msg.clienteBanco) {
      (document.getElementById("nome") as HTMLInputElement).value = msg.clienteBanco.nome;
      (document.getElementById("telefone") as HTMLInputElement).value = msg.clienteBanco.telefone;
      (document.getElementById("endereco") as HTMLInputElement).value = msg.clienteBanco.endereco;
    }
  });
});
