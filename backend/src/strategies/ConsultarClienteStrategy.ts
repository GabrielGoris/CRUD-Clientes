import IStrategy from "./IStrategy";
import Cliente from "../domain/Cliente";
import ClienteDAO from "../daos/ClienteDAO";

const consultarClienteStrategy: IStrategy<Cliente> = {
    async executar(id: number): Promise<Cliente | null> {
        const dao = new ClienteDAO();
        return dao.consultar(id);
    }
};

export default consultarClienteStrategy; 