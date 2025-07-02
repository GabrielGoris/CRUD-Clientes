import IStrategy from "./IStrategy";
import Cliente from "../domain/Cliente";
import ClienteDAO from "../daos/ClienteDAO";

const listarClienteStrategy: IStrategy<Cliente> = {
    async executar(): Promise<Cliente[]> {
        const dao = new ClienteDAO();
        return dao.listar();
    }
};

export default listarClienteStrategy; 