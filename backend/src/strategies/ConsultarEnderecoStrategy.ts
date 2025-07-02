import IStrategy from "./IStrategy";
import Endereco from "../domain/Endereco";
import EnderecoDAO from "../daos/EnderecoDAO";

const consultarEnderecoStrategy: IStrategy<Endereco> = {
    async executar(id: number): Promise<Endereco | null> {
        const dao = new EnderecoDAO();
        return dao.consultar(id);
    }
};

export default consultarEnderecoStrategy; 