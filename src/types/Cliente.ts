export interface Endereco {
  id: string;
  clienteId: string;
  tipo: 'COBRANCA' | 'ENTREGA';
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface CartaoCredito {
  id: string;
  clienteId: string;
  numero: string;
  nomeTitular: string;
  dataValidade: string;
  bandeira: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX';
  cvv: string;
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: string;
  telefone: string;
  status?: 'ATIVO' | 'INATIVO';
  genero?: 'MASCULINO' | 'FEMININO' | 'OUTROS';
} 