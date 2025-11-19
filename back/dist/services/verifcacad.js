"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
    // Botões da tela
    const btnCadastrar = document.getElementById("btnCadastrar");
    const btnCadastro = document.getElementById("btnCadastro");
    // Função utilitária para capturar dados do formulário
    function getFormData() {
        return {
            cpf: document.getElementById("cpf").value.trim(),
            nome: document.getElementById("nome").value.trim(),
            telefone: document.getElementById("telefone").value.trim(),
            endereco: document.getElementById("endereco").value.trim(),
            senha: document.getElementById("senha").value.trim()
        };
    }
    // -----------------------------
    // Cadastro normal de cliente
    // -----------------------------
    btnCadastrar.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const dados = getFormData(); // pega dados do formulário
        // Faz requisição POST para a rota /clientes
        const res = yield fetch("http://localhost:3000/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const msg = yield res.json();
        alert(msg.message || msg.error); // mostra mensagem de sucesso ou erro
    }));
    // -----------------------------
    // Verificação + autocompletar
    // -----------------------------
    btnCadastro.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const dados = getFormData();
        // Faz requisição POST para a rota /verificar
        const res = yield fetch("http://localhost:3000/verificar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const msg = yield res.json();
        // Mostra mensagem de sucesso ou erro
        alert(msg.message || msg.error);
        // Se CPF + senha forem válidos, preenche automaticamente os campos
        if (msg.clienteBanco && !msg.error) {
            document.getElementById("nome").value = msg.clienteBanco.nome;
            document.getElementById("telefone").value = msg.clienteBanco.telefone;
            document.getElementById("endereco").value = msg.clienteBanco.endereco;
        }
    }));
});
//# sourceMappingURL=verifcacad.js.map