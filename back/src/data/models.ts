// Interface que define a estrutura de um Cliente
export interface Cliente {
  id?: number; // opcional, gerado automaticamente pelo banco
  cpf: string; // CPF do cliente
  nome: string; // Nome do cliente
  endereco: string; // Endereço do cliente
  telefone: string; // Telefone do cliente
  senha: string; // Senha de acesso
}

// Interface que define a estrutura de um Pedido
export interface Pedido {
  id?: number; // opcional, gerado automaticamente pelo banco
  cliente_id: number; // ID do cliente que fez o pedido
  cpf: string; // CPF do cliente
  data_pedido: string; // Data do pedido
  pizza: string; // Tipo/sabor da pizza
  quantidade_pizza: number; // Quantidade de pizzas
  tamanho: string; // Tamanho da pizza (P, M, G)
  bebida: string; // Bebida escolhida
  quantidade_bebida: number; // Quantidade de bebidas
  sobremesa: string; // Sobremesa escolhida
  quantidade_sobremesa: number; // Quantidade de sobremesas
  adicional: string; // Adicional escolhido
  quantidade_adicional: number; // Quantidade de adicionais
  observacoes: string; // Observações do cliente (ex: sem cebola)
  forma_pagamento: string; // Forma de pagamento (Pix, cartão, dinheiro)
  preco_total: number; // Valor total do pedido
  cupom: string; // Cupom de desconto
}