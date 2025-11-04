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
  quantidade_pizza: number;
  tamanho: string;
  bebida: string;
  quantidade_bebida: number;
  sobremesa: string;
  quantidade_sobremesa: number;
  adicional: string;
  quantidade_adicional: number;
  observacoes: string;
  forma_pagamento: string;
  preco_total: number;
  cupom: string;
}

