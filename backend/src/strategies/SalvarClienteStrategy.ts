import IStrategy from "./IStrategy";
import Cliente from "../domain/Cliente";
import ClienteDAO from "../daos/ClienteDAO";

const salvarClienteStrategy: IStrategy<Cliente> = {
    async executar(entidade: Cliente): Promise<Cliente> {
        const dao = new ClienteDAO();
        return dao.salvar(entidade);
    }
};

export default salvarClienteStrategy; 