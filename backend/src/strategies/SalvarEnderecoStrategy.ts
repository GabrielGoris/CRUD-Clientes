import IStrategy from "./IStrategy";
import Endereco from "../domain/Endereco";
import EnderecoDAO from "../daos/EnderecoDAO";

const salvarEnderecoStrategy: IStrategy<Endereco> = {
    async executar(entidade: Endereco, clienteId: number): Promise<Endereco> {
        const dao = new EnderecoDAO();
        return dao.salvar(entidade, clienteId);
    }
};

export default salvarEnderecoStrategy; 