import IStrategy from "./IStrategy";
import Endereco from "../domain/Endereco";
import EnderecoDAO from "../daos/EnderecoDAO";

const listarEnderecoStrategy: IStrategy<Endereco> = {
    async executar(clienteId: number): Promise<Endereco[]> {
        const dao = new EnderecoDAO();
        return dao.listar(clienteId);
    }
};

export default listarEnderecoStrategy; 