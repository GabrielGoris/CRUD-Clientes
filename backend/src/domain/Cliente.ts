import Endereco from "./Endereco";
import CartaoCredito from "./CartaoCredito";

export default class Cliente {
    id?: number;
    nome: string;
    email: string;
    cpf: string;
    dataNascimento: string;
    enderecos: Endereco[];
    cartoes: CartaoCredito[];
    telefone: string;
    status: 'ATIVO' | 'INATIVO';
    genero: 'MASCULINO' | 'FEMININO' | 'OUTROS';

    constructor(
        nome: string,
        email: string,
        cpf: string,
        dataNascimento: string,
        enderecos: Endereco[] = [],
        cartoes: CartaoCredito[] = [],
        telefone: string,
        status: 'ATIVO' | 'INATIVO' = 'ATIVO',
        genero: 'MASCULINO' | 'FEMININO' | 'OUTROS' = 'OUTROS',
        id?: number
    ) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.enderecos = enderecos;
        this.cartoes = cartoes;
        this.telefone = telefone;
        this.status = status;
        this.genero = genero;
        this.id = id;
    }
} 