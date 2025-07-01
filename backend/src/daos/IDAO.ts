export default interface IDAO<T> {
    salvar(entidade: T): Promise<T>;
    alterar(entidade: T): Promise<T>;
    excluir(id: number): Promise<void>;
    consultar(id: number): Promise<T | null>;
    listar(): Promise<T[]>;
} 