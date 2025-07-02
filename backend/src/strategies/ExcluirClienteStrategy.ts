import IStrategy from "./IStrategy";
import ClienteDAO from "../daos/ClienteDAO";

const excluirClienteStrategy: IStrategy<any> = {
    async executar(id: number): Promise<void> {
        const dao = new ClienteDAO();
        return dao.excluir(id);
    }
};

export default excluirClienteStrategy; 