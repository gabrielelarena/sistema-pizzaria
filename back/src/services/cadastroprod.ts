const nomeInput = document.getElementById("nomePizza") as HTMLInputElement;
const precoInput = document.getElementById("precoPizza") as HTMLInputElement;
const tamanhoSelect = document.getElementById("tamanhoPizza") as HTMLSelectElement;
const idInput = document.getElementById("idPizza") as HTMLInputElement;
const nomeBebidaInput = document.getElementById("nomeBebida") as HTMLInputElement;
const precoBebidaInput = document.getElementById("precoBebida") as HTMLInputElement;
const idBebidaInput = document.getElementById("idBebida") as HTMLInputElement;
const nomeSobremesaInput = document.getElementById("nomeSobremesa") as HTMLInputElement;
const precoSobremesaInput = document.getElementById("precoSobremesa") as HTMLInputElement;
const idSobremesaInput = document.getElementById("idSobremesa") as HTMLInputElement;
const nomeAdicionalInput = document.getElementById("nomeAdicional") as HTMLInputElement;
const precoAdicionalInput = document.getElementById("precoAdicional") as HTMLInputElement;
const idAdicionalInput = document.getElementById("idAdicional") as HTMLInputElement;

const btnCadastrarB = document.getElementById("cadastrabebida") as HTMLButtonElement;
const btnAtualizarB = document.getElementById("alterabebida") as HTMLButtonElement;
const btnExcluirB = document.getElementById("excluibebida") as HTMLButtonElement;
const btnCadastrarP = document.getElementById("cadastrapizza") as HTMLButtonElement;
const btnAtualizarP = document.getElementById("alterapizza") as HTMLButtonElement;
const btnExcluirP = document.getElementById("excluipizza") as HTMLButtonElement;
const btnExcluirS = document.getElementById("excluisobremesa") as HTMLButtonElement;
const btnCadastrarS = document.getElementById("cadastrasobremesa") as HTMLButtonElement;
const btnAtualizarS = document.getElementById("alterasobremesa") as HTMLButtonElement;
const btnCadastrarA = document.getElementById("cadastraadicional") as HTMLButtonElement;
const btnAtualizarA = document.getElementById("alteraadicional") as HTMLButtonElement;
const btnExcluirA = document.getElementById("excluiadicional") as HTMLButtonElement;

// Utilitário para converter preço corretamente
function parsePreco(valor: string): number {
  const normalizado = valor.replace(',', '.');
  const preco = parseFloat(normalizado);
  return isNaN(preco) ? 0 : preco;
}

// Limpar campos do formulário
function limparCampos() {
  nomeInput.value = "";
  precoInput.value = "";
  tamanhoSelect.selectedIndex = 0;
  idInput.value = "";
  idBebidaInput.value = "";
  nomeBebidaInput.value = "";
  precoBebidaInput.value = "";
  nomeSobremesaInput.value = "";
  precoSobremesaInput.value = "";
  idSobremesaInput.value = "";
  nomeAdicionalInput.value = "";
  precoAdicionalInput.value = "";
  idAdicionalInput.value = "";
}

// Cadastrar pizza
btnCadastrarP.addEventListener("click", () => {
  const nome = nomeInput.value.trim();
  const tamanho = tamanhoSelect.options[tamanhoSelect.selectedIndex].text;
  const preco = parsePreco(precoInput.value);
  const pizza = { nome, tamanho, preco };

  fetch("http://localhost:3000/pizzas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pizza),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar pizza.");
    });
});

// Atualizar pizza
btnAtualizarP.addEventListener("click", () => {
  const id = parseInt(idInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para atualizar.");
    return;
  }

  const nome = nomeInput.value.trim();
  const tamanho = tamanhoSelect.options[tamanhoSelect.selectedIndex].text;
  const preco = parsePreco(precoInput.value);

  const pizza: any = {};
  if (nome) pizza.nome = nome;
  if (tamanho && tamanho !== "Selecione um tamanho:") pizza.tamanho = tamanho;
  if (preco > 0) pizza.preco = preco;

  if (Object.keys(pizza).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/pizzas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pizza),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar pizza.");
    });
});

// Excluir pizza
btnExcluirP.addEventListener("click", () => {
  const id = parseInt(idInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para excluir.");
    return;
  }

  fetch(`http://localhost:3000/pizzas/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir pizza.");
    });
});

// Cadastrar bebida
btnCadastrarB.addEventListener("click", () => {
  const nome = nomeBebidaInput.value.trim();
  const preco = parsePreco(precoBebidaInput.value);

  if (!nome || preco <= 0) {
    alert("Preencha o nome e um preço válido.");
    return;
  }

  const bebida = { nome, preco };

  fetch("http://localhost:3000/bebidas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bebida),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar bebida:", err);
      alert("Erro ao cadastrar bebida.");
    });
});

// Atualizar bebida
btnAtualizarB.addEventListener("click", () => {
  const id = parseInt(idBebidaInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para atualizar.");
    return;
  }

  const nome = nomeBebidaInput.value.trim();
  const preco = parsePreco(precoBebidaInput.value);

  const bebida: any = {};
  if (nome) bebida.nome = nome;
  if (preco > 0) bebida.preco = preco;

  if (Object.keys(bebida).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/bebidas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bebida),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar bebida:", err);
      alert("Erro ao atualizar bebida.");
    });
});

// Excluir bebida
btnExcluirB.addEventListener("click", () => {
  const id = parseInt(idBebidaInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para excluir.");
    return;
  }

  fetch(`http://localhost:3000/bebidas/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir bebida:", err);
      alert("Erro ao excluir bebida.");
    });
});

// Cadastrar sobremesa
btnCadastrarS.addEventListener("click", () => {
  const nome = nomeSobremesaInput.value.trim();
  const preco = parsePreco(precoSobremesaInput.value);

  if (!nome || preco <= 0) {
    alert("Preencha o nome e um preço válido.");
    return;
  }

  const sobremesa = { nome, preco };

  fetch("http://localhost:3000/sobremesas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sobremesa),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar sobremesa:", err);
      alert("Erro ao cadastrar sobremesa.");
    });
});


// Atualizar sobremesa
btnAtualizarS.addEventListener("click", () => {
  const id = parseInt(idSobremesaInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para atualizar.");
    return;
  }

  const nome = nomeSobremesaInput.value.trim();
  const preco = parsePreco(precoSobremesaInput.value);

  const sobremesa: any = {};
  if (nome) sobremesa.nome = nome;
  if (preco > 0) sobremesa.preco = preco;

  if (Object.keys(sobremesa).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/sobremesas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sobremesa),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar sobremesa:", err);
      alert("Erro ao atualizar sobremesa.");
    });
});

// Excluir sobremesa
btnExcluirS.addEventListener("click", () => {
  const id = parseInt(idSobremesaInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para excluir.");
    return;
  }

  fetch(`http://localhost:3000/sobremesas/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir sobremesa:", err);
      alert("Erro ao excluir sobremesa.");
    });
});


// Cadastrar adicional
btnCadastrarA.addEventListener("click", () => {
  const nome = nomeAdicionalInput.value.trim();
  const preco = parsePreco(precoAdicionalInput.value);

  if (!nome || preco <= 0) {
    alert("Preencha o nome e um preço válido.");
    return;
  }

  const adicional = { nome, preco };

  fetch("http://localhost:3000/adicionais", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adicional),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao cadastrar adicional:", err);
      alert("Erro ao cadastrar adicional.");
    });
});


// Atualizar adicional
btnAtualizarA.addEventListener("click", () => {
  const id = parseInt(idAdicionalInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para atualizar.");
    return;
  }

  const nome = nomeAdicionalInput.value.trim();
  const preco = parsePreco(precoAdicionalInput.value);

  const adicional: any = {};
  if (nome) adicional.nome = nome;
  if (preco > 0) adicional.preco = preco;

  if (Object.keys(adicional).length === 0) {
    alert("Preencha ao menos um campo para atualizar.");
    return;
  }

  fetch(`http://localhost:3000/adicionais/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(adicional),
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao atualizar adicional:", err);
      alert("Erro ao atualizar adicional.");
    });
});

// Excluir adicional
btnExcluirA.addEventListener("click", () => {
  const id = parseInt(idAdicionalInput.value);
  if (isNaN(id) || id <= 0) {
    alert("Informe um ID válido para excluir.");
    return;
  }

  fetch(`http://localhost:3000/adicionais/${id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || data.error);
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao excluir adicional:", err);
      alert("Erro ao excluir adicional.");
    });
});

