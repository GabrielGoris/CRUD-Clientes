import Cliente from "../domain/Cliente";
import IDAO from "./IDAO";
import { getDbConnection } from "../database";

export default class ClienteDAO implements IDAO<Cliente> {

    async salvar(entidade: Cliente): Promise<Cliente> {
        const db = await getDbConnection();
        const sql = `INSERT INTO clientes (nome, email, cpf, dataNascimento, telefone, status, genero) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const { lastID } = await db.run(
            sql,
            entidade.nome,
            entidade.email,
            entidade.cpf,
            entidade.dataNascimento,
            entidade.telefone,
            entidade.status,
            entidade.genero
        );
        // Buscar o cliente recém-cadastrado
        const cliente = await db.get("SELECT * FROM clientes WHERE id = ?", lastID);
        return cliente;
    }

    async alterar(entidade: Cliente): Promise<Cliente> {
        const db = await getDbConnection();
        const sql = `UPDATE clientes SET nome = ?, email = ?, cpf = ?, dataNascimento = ?, telefone = ?, status = ?, genero = ? WHERE id = ?`;
        await db.run(
            sql,
            entidade.nome,
            entidade.email,
            entidade.cpf,
            entidade.dataNascimento,
            entidade.telefone,
            entidade.status,
            entidade.genero,
            entidade.id
        );
        return entidade;
    }

    async excluir(id: number): Promise<void> {
        const db = await getDbConnection();
        await db.run("DELETE FROM clientes WHERE id = ?", id);
    }

    async consultar(id: number): Promise<Cliente | null> {
        const db = await getDbConnection();
        const cliente = await db.get("SELECT * FROM clientes WHERE id = ?", id);
        return cliente || null;
    }

    async listar(): Promise<Cliente[]> {
        const db = await getDbConnection();
        const clientes = await db.all("SELECT * FROM clientes");
        return clientes;
    }
} 