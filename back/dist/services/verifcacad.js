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
    // Função de validação dos campos obrigatórios
    function validarCampos(dados) {
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
    btnCadastrar.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const dados = getFormData();
        // Validação
        const erro = validarCampos(dados);
        if (erro) {
            alert(erro);
            return; // interrompe se houver erro
        }
        // Faz requisição POST para a rota /clientes
        const res = yield fetch("http://localhost:3000/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const msg = yield res.json();
        alert(msg.message || msg.error);
    }));
    // -----------------------------
    // Verificação + autocompletar
    // -----------------------------
    btnCadastro.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const dados = getFormData();
        // Validação
        const erro = validarCampos(dados);
        if (erro) {
            alert(erro);
            return;
        }
        // Faz requisição POST para a rota /verificar
        const res = yield fetch("http://localhost:3000/verificar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        const msg = yield res.json();
        alert(msg.message || msg.error);
        if (msg.clienteBanco && !msg.error) {
            document.getElementById("nome").value = msg.clienteBanco.nome;
            document.getElementById("telefone").value = msg.clienteBanco.telefone;
            document.getElementById("endereco").value = msg.clienteBanco.endereco;
        }
    }));
});
//# sourceMappingURL=verifcacad.js.map