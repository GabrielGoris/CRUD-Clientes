export default class Endereco {
    id?: number;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    tipo: 'cobranca' | 'entrega';

    constructor(
        logradouro: string,
        numero: string,
        bairro: string,
        cidade: string,
        estado: string,
        cep: string,
        tipo: 'cobranca' | 'entrega',
        id?: number
    ) {
        this.logradouro = logradouro;
        this.numero = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.tipo = tipo;
        this.id = id;
    }
} 