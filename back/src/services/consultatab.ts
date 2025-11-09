const idClienteInput = document.getElementById("idcliente") as HTMLInputElement;
const cpfClienteConsulta = document.getElementById("CpfCliente") as HTMLInputElement;
const nomeClienteConsulta = document.getElementById("NomeCliente") as HTMLInputElement;
const resultadoClienteDiv = document.getElementById("resultadoCliente") as HTMLDivElement;
const btnConsultaCliente = document.getElementById("consultacliente") as HTMLButtonElement;

function consultarProduto(tipo: string, id: string) {
  if (!id || isNaN(parseInt(id))) {
    alert("Informe um ID válido.");
    return;
  }

  fetch(`http://localhost:3000/produto?tipo=${tipo}&id=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        const p = data.produto;
        alert(`Produto encontrado:\nNome: ${p.nome}\nPreço: R$ ${p.preco}${p.tamanho ? `\nTamanho: ${p.tamanho}` : ""}`);
      }
    })
    .catch(err => {
      console.error("Erro ao consultar produto:", err);
      alert("Erro ao consultar produto.");
    });
}

document.getElementById("consultapizza")?.addEventListener("click", () => {
  const id = (document.getElementById("idPizza") as HTMLInputElement).value.trim();
  consultarProduto("pizza", id);
});

document.getElementById("consultabebida")?.addEventListener("click", () => {
  const id = (document.getElementById("idBebida") as HTMLInputElement).value.trim();
  consultarProduto("bebida", id);
});

document.getElementById("consultasobremesa")?.addEventListener("click", () => {
  const id = (document.getElementById("idSobremesa") as HTMLInputElement).value.trim();
  consultarProduto("sobremesa", id);
});

document.getElementById("consultaadicional")?.addEventListener("click", () => {
  const id = (document.getElementById("idAdicional") as HTMLInputElement).value.trim();
  consultarProduto("adicional", id);
});

btnConsultaCliente.addEventListener("click", () => {
  resultadoClienteDiv.innerHTML = "";

  const id = idClienteInput.value.trim();
  const cpf = cpfClienteConsulta.value.trim();
  const nome = nomeClienteConsulta.value.trim();

  if (!id && !cpf && !nome) {
    resultadoClienteDiv.innerHTML = `<p class="text-danger">Preencha ao menos um campo para consultar.</p>`;
    return;
  }

  const params = new URLSearchParams();
  if (id) params.append("id", id);
  if (cpf) params.append("cpf", cpf);
  if (nome) params.append("nome", nome);

  fetch(`http://localhost:3000/clientes?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        resultadoClienteDiv.innerHTML = `<p class="text-danger">${data.error}</p>`;
      } else {
        const lista = data.clientes.map((c: any) => `
          <div class="mb-3">
            <h5 class="text-success">Cliente #${c.id}</h5>
            <ul>
              <li><strong>Nome:</strong> ${c.nome}</li>
              <li><strong>CPF:</strong> ${c.cpf}</li>
              <li><strong>Endereço:</strong> ${c.endereco || "Não informado"}</li>
              <li><strong>Telefone:</strong> ${c.telefone || "Não informado"}</li>
            </ul>
          </div>
        `).join("");

        resultadoClienteDiv.innerHTML = lista;
      }
    })
    .catch(err => {
      console.error("Erro ao consultar cliente:", err);
      resultadoClienteDiv.innerHTML = `<p class="text-danger">Erro ao consultar cliente.</p>`;
    });
});