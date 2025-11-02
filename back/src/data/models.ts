export interface Cliente {
  id?: number; // gerado pelo banco
  cpf: string;
  nome: string;
  endereco: string;
  telefone: string;
}

export interface Pedido {
  id?: number;
  cliente_id: number;
  cpf: string;
  data_pedido: string;
  pizza: string;
  tamanho: string;
  quantidade_pizza: number;
  bebida: string;
  quantidade_bebida: number;
  sobremesa: string;
  quantidade_sobremesa: number;
  observacoes: string;
  forma_pagamento: string;
  preco_total: number;
  cupom: string;
}

