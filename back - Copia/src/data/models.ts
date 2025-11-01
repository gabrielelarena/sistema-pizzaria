export interface Cliente {
  cliente_id: string;
  cpf: string;
  nome: string;
  endereco: string;
  telefone: string;
}

export interface Pedido {
  data_pedido: string;
  cpf: string;
  pizza: string;
  quantidade_pizza: number;
  tamanho: string;
  bebida: string;
  quantidade_bebida: number;
  sobremesa: string;
  quantidade_sobremesa: number;
  observacoes: string;
  forma_pagamento: string;
  preco_total: number;
  cupom: string;
}

