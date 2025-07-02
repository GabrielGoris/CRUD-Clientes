import IStrategy from "./IStrategy";
import EnderecoDAO from "../daos/EnderecoDAO";

const excluirEnderecoStrategy: IStrategy<any> = {
    async executar(id: number): Promise<void> {
        const dao = new EnderecoDAO();
        return dao.excluir(id);
    }
};

export default excluirEnderecoStrategy; 