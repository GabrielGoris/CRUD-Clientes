export default class CartaoCredito {
    id?: number;
    numero: string;
    nomeTitular: string;
    dataValidade: string; // Ex: "12/28"
    cvv: string;

    constructor(
        numero: string,
        nomeTitular: string,
        dataValidade: string,
        cvv: string,
        id?: number
    ) {
        this.numero = numero;
        this.nomeTitular = nomeTitular;
        this.dataValidade = dataValidade;
        this.cvv = cvv;
        this.id = id;
    }
} 