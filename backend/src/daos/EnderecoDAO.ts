import Endereco from "../domain/Endereco";
import IDAO from "./IDAO";
import { getDbConnection } from "../database";

export default class EnderecoDAO implements IDAO<Endereco> {
    
    // Método para salvar um endereço associado a um cliente
    async salvar(entidade: Endereco, clienteId?: number): Promise<Endereco> {
        const db = await getDbConnection();
        const sql = `INSERT INTO enderecos (logradouro, numero, bairro, cidade, estado, cep, tipo, cliente_id) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const { lastID } = await db.run(
            sql, 
            entidade.logradouro,
            entidade.numero,
            entidade.bairro,
            entidade.cidade,
            entidade.estado,
            entidade.cep,
            entidade.tipo,
            clienteId
        );

        const endereco = await db.get("SELECT * FROM enderecos WHERE id = ?", lastID);
        return endereco;
    }

    async alterar(entidade: Endereco): Promise<Endereco> {
        const db = await getDbConnection();
        const sql = `UPDATE enderecos SET logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ?, tipo = ? WHERE id = ?`;
        await db.run(
            sql,
            entidade.logradouro,
            entidade.numero,
            entidade.bairro,
            entidade.cidade,
            entidade.estado,
            entidade.cep,
            entidade.tipo,
            entidade.id
        );
        return entidade;
    }

    async excluir(id: number): Promise<void> {
        const db = await getDbConnection();
        await db.run("DELETE FROM enderecos WHERE id = ?", id);
    }

    async consultar(id: number): Promise<Endereco | null> {
        const db = await getDbConnection();
        const endereco = await db.get("SELECT * FROM enderecos WHERE id = ?", id);
        return endereco || null;
    }

    // Lista todos os endereços de um cliente específico
    async listar(clienteId?: number): Promise<Endereco[]> {
        if (clienteId === undefined) {
            throw new Error("ID do cliente é necessário para listar endereços.");
        }
        const db = await getDbConnection();
        const enderecos = await db.all("SELECT * FROM enderecos WHERE cliente_id = ?", clienteId);
        return enderecos;
    }
} 