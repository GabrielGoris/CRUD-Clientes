import CartaoCredito from "../domain/CartaoCredito";
import IDAO from "./IDAO";
import { getDbConnection } from "../database";

export default class CartaoDAO implements IDAO<CartaoCredito> {

    async salvar(entidade: CartaoCredito, clienteId?: number): Promise<CartaoCredito> {
        const db = await getDbConnection();
        const sql = `INSERT INTO cartoes_credito (numero, nomeTitular, dataValidade, cvv, cliente_id) 
                     VALUES (?, ?, ?, ?, ?)`;
        
        const { lastID } = await db.run(
            sql, 
            entidade.numero,
            entidade.nomeTitular,
            entidade.dataValidade,
            entidade.cvv,
            clienteId
        );

        const cartao = await db.get("SELECT * FROM cartoes_credito WHERE id = ?", lastID);
        return cartao;
    }

    async alterar(entidade: CartaoCredito): Promise<CartaoCredito> {
        const db = await getDbConnection();
        const sql = `UPDATE cartoes_credito SET numero = ?, nomeTitular = ?, dataValidade = ?, cvv = ? WHERE id = ?`;
        await db.run(
            sql,
            entidade.numero,
            entidade.nomeTitular,
            entidade.dataValidade,
            entidade.cvv,
            entidade.id
        );
        return entidade;
    }

    async excluir(id: number): Promise<void> {
        const db = await getDbConnection();
        await db.run("DELETE FROM cartoes_credito WHERE id = ?", id);
    }

    async consultar(id: number): Promise<CartaoCredito | null> {
        const db = await getDbConnection();
        const cartao = await db.get("SELECT * FROM cartoes_credito WHERE id = ?", id);
        return cartao || null;
    }

    async listar(clienteId?: number): Promise<CartaoCredito[]> {
        if (clienteId === undefined) {
            throw new Error("ID do cliente é necessário para listar cartões.");
        }
        const db = await getDbConnection();
        const cartoes = await db.all("SELECT * FROM cartoes_credito WHERE cliente_id = ?", clienteId);
        return cartoes;
    }
} 