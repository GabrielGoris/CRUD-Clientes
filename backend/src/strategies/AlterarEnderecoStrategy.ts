import IStrategy from "./IStrategy";
import Endereco from "../domain/Endereco";
import EnderecoDAO from "../daos/EnderecoDAO";

const alterarEnderecoStrategy: IStrategy<Endereco> = {
    async executar(entidade: Endereco): Promise<Endereco> {
        const dao = new EnderecoDAO();
        return dao.alterar(entidade);
    }
};

export default alterarEnderecoStrategy; 