import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Singleton para garantir uma única instância do banco de dados
let dbInstance: any = null;

export async function getDbConnection() {
    if (dbInstance) {
        return dbInstance;
    }

    const db = await open({
        filename: './database.db', // Arquivo do banco de dados
        driver: sqlite3.Database
    });

    // Criar as tabelas se elas não existirem
    await db.exec(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            cpf TEXT NOT NULL UNIQUE,
            dataNascimento TEXT NOT NULL,
            telefone TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'ATIVO',
            genero TEXT NOT NULL DEFAULT 'OUTROS'
        );

        CREATE TABLE IF NOT EXISTS enderecos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            logradouro TEXT NOT NULL,
            numero TEXT NOT NULL,
            bairro TEXT NOT NULL,
            cidade TEXT NOT NULL,
            estado TEXT NOT NULL,
            cep TEXT NOT NULL,
            tipo TEXT NOT NULL,
            cliente_id INTEGER,
            FOREIGN KEY (cliente_id) REFERENCES clientes (id)
        );

        CREATE TABLE IF NOT EXISTS cartoes_credito (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT NOT NULL,
            nomeTitular TEXT NOT NULL,
            dataValidade TEXT NOT NULL,
            cvv TEXT NOT NULL,
            cliente_id INTEGER,
            FOREIGN KEY (cliente_id) REFERENCES clientes (id)
        );
    `);

    // Verifica se a coluna telefone existe na tabela clientes e adiciona caso não exista
    const colunasClientes = await db.all("PRAGMA table_info(clientes)");
    const temTelefone = colunasClientes.some((col: any) => col.name === 'telefone');
    if (!temTelefone) {
        await db.exec("ALTER TABLE clientes ADD COLUMN telefone TEXT NOT NULL DEFAULT '';");
    }

    // Verifica se a coluna status existe na tabela clientes e adiciona caso não exista
    const temStatus = colunasClientes.some((col: any) => col.name === 'status');
    if (!temStatus) {
        await db.exec("ALTER TABLE clientes ADD COLUMN status TEXT NOT NULL DEFAULT 'ATIVO';");
    }

    // Verifica se a coluna genero existe na tabela clientes e adiciona caso não exista
    const temGenero = colunasClientes.some((col: any) => col.name === 'genero');
    if (!temGenero) {
        await db.exec("ALTER TABLE clientes ADD COLUMN genero TEXT NOT NULL DEFAULT 'OUTROS';");
    }

    dbInstance = db;
    return db;
} 