export interface Cliente {
  cpf: string;
  nome: string;
  telefone: string;
  endereco: string;
  pagamento: string;
}

export interface Pedido {
  pizza: string;
  tamanho: string;
  quantidadePizza: number;
  bebida: string;
  quantidadeBebida: number;
  data_pedido: string;
}
