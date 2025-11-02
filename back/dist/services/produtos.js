"use strict";
// Mapeamento de preços de pizza por sabor e tamanho
const precosPizza = {
    "Mussarela": { "Pequena": 23, "Média": 33, "Grande": 43 },
    "Calabresa": { "Pequena": 25, "Média": 35, "Grande": 45 },
    "Portuguesa": { "Pequena": 26, "Média": 36, "Grande": 46 },
    "Frango com Catupiry": { "Pequena": 27, "Média": 37, "Grande": 47 },
    "Marguerita": { "Pequena": 24, "Média": 34, "Grande": 44 },
    "Quatro Queijos": { "Pequena": 28, "Média": 38, "Grande": 48 },
    "Pepperoni": { "Pequena": 29, "Média": 39, "Grande": 49 },
    "Bacon com Milho": { "Pequena": 27, "Média": 37, "Grande": 47 },
    "Lombo": { "Pequena": 30, "Média": 40, "Grande": 50 },
    "Palmito": { "Pequena": 26, "Média": 36, "Grande": 46 },
    "Rúcula com Tomate Seco": { "Pequena": 28, "Média": 38, "Grande": 48 },
    "Brócolis com Bacon": { "Pequena": 27, "Média": 37, "Grande": 47 },
    "M&M (Doce)": { "Pequena": 22, "Média": 32, "Grande": 42 },
    "Doce de Leite (Doce)": { "Pequena": 22, "Média": 32, "Grande": 42 },
    "Chocolate (Doce)": { "Pequena": 23, "Média": 33, "Grande": 43 },
};
// Mapeamento de preços de sobremesas
const precosSobremesa = {
    "Brownie": 10,
    "Petit Gâteau": 14,
    "Torta de Limão": 12,
    "Pudim": 11,
    "Sorvete": 9,
    "Cheesecake": 13,
    "Mousse de Maracujá": 10,
    "Tiramisu": 15,
    "Brigadeiro": 5,
    "Beijinho": 5,
};
// Mapeamento de preços de bebidas
const precosBebida = {
    "Água Mineral (c/ gás)": 4.00,
    "Água Mineral (s/ gás)": 3.50,
    "Refrigerante Lata (Coca)": 6.00,
    "Refrigerante Lata (Guaraná)": 6.00,
    "Cerveja Pilsen (Long Neck)": 7.50,
    "Suco de Laranja (Jarra)": 10.00,
    "Suco de Abacaxi (Jarra)": 10.00,
};
// Inputs do HTML
const sabor = document.getElementById("Sabor");
const tamanho = document.getElementById("tamanho");
const qtdPizza = document.getElementById("quantidade_pizza");
const bebida = document.getElementById("bebida");
const qtdBebida = document.getElementById("quantidade_bebida");
const sobremesa = document.getElementById("sobremesa");
const qtdSobremesa = document.getElementById("quantidade_sobremesa");
// Botão para calcular
const btnCalcular = document.getElementById("btnCalcular");
btnCalcular.addEventListener("click", () => {
    var _a;
    const saborSelecionado = sabor.options[sabor.selectedIndex].text;
    const tamanhoSelecionado = tamanho.options[tamanho.selectedIndex].text;
    const quantidadePizza = parseInt(qtdPizza.value);
    const bebidaSelecionada = bebida.options[bebida.selectedIndex].text;
    const quantidadeBebida = parseInt(qtdBebida.value);
    const sobremesaSelecionada = sobremesa.options[sobremesa.selectedIndex].text;
    const quantidadeSobremesa = parseInt(qtdSobremesa.value);
    const precoPizza = ((_a = precosPizza[saborSelecionado]) === null || _a === void 0 ? void 0 : _a[tamanhoSelecionado]) || 0;
    const precoBebida = precosBebida[bebidaSelecionada] || 0;
    const precoSobremesa = precosSobremesa[sobremesaSelecionada] || 0;
    const total = quantidadePizza * precoPizza +
        quantidadeBebida * precoBebida +
        quantidadeSobremesa * precoSobremesa;
    const pedido = {
        pizza: { sabor: saborSelecionado, tamanho: tamanhoSelecionado, quantidade: quantidadePizza, precoUnitario: precoPizza },
        bebida: { nome: bebidaSelecionada, quantidade: quantidadeBebida, precoUnitario: precoBebida },
        sobremesa: { nome: sobremesaSelecionada, quantidade: quantidadeSobremesa, precoUnitario: precoSobremesa },
        preco_total: total.toFixed(2),
    };
    console.log("Pedido calculado:", JSON.stringify(pedido, null, 2));
});
//# sourceMappingURL=produtos.js.map