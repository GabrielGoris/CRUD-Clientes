import IDAO from "../daos/IDAO";
import Cliente from "../domain/Cliente";
import Endereco from "../domain/Endereco";
import CartaoCredito from "../domain/CartaoCredito";
import ClienteDAO from "../daos/ClienteDAO";
import EnderecoDAO from "../daos/EnderecoDAO";
import CartaoDAO from "../daos/CartaoDAO";

export default class GenericFacade<T> {
    private daos: Map<string, IDAO<any>>;

    constructor() {
        this.daos = new Map<string, IDAO<any>>();
        this.daos.set(Cliente.name, new ClienteDAO());
        this.daos.set(Endereco.name, new EnderecoDAO());
        this.daos.set(CartaoCredito.name, new CartaoDAO());
    }

    async salvar(entidade: T, idRelacional?: number): Promise<string> {
        const nomeEntidade = (entidade as any).constructor.name;
        const dao = this.daos.get(nomeEntidade);
        if (!dao) {
            return "DAO não encontrada para esta entidade.";
        }
        await (dao as any).salvar(entidade, idRelacional);
        return "Salvo com sucesso!";
    }

    async listar(nomeEntidade: string, idRelacional?: number): Promise<any[]> {
        const dao = this.daos.get(nomeEntidade);
        if (!dao) {
            throw new Error("DAO não encontrada para esta entidade.");
        }
        return (dao as any).listar(idRelacional);
    }

    async consultar(nomeEntidade: string, id: number): Promise<any> {
        const dao = this.daos.get(nomeEntidade);
        if (!dao) {
            throw new Error("DAO não encontrada para esta entidade.");
        }
        return dao.consultar(id);
    }

    async alterar(entidade: T): Promise<string> {
        const nomeEntidade = (entidade as any).constructor.name;
        const dao = this.daos.get(nomeEntidade);
        if (!dao) {
            return "DAO não encontrada para esta entidade.";
        }
        await dao.alterar(entidade);
        return "Alterado com sucesso!";
    }

    async excluir(nomeEntidade: string, id: number): Promise<string> {
        const dao = this.daos.get(nomeEntidade);
        if (!dao) {
            throw new Error("DAO não encontrada para esta entidade.");
        }
        await dao.excluir(id);
        return "Excluído com sucesso!";
    }

    async salvarEndereco(endereco: any, clienteId: number) {
        const dao = this.daos.get('Endereco');
        if (!dao) throw new Error('DAO de Endereco não encontrada');
        return (dao as any).salvar(endereco, clienteId);
    }

    async consultarEndereco(id: number) {
        const dao = this.daos.get('Endereco');
        if (!dao) throw new Error('DAO de Endereco não encontrada');
        return dao.consultar(id);
    }

    async alterarEndereco(endereco: any) {
        const dao = this.daos.get('Endereco');
        if (!dao) throw new Error('DAO de Endereco não encontrada');
        return dao.alterar(endereco);
    }

    async excluirEndereco(id: number) {
        const dao = this.daos.get('Endereco');
        if (!dao) throw new Error('DAO de Endereco não encontrada');
        return dao.excluir(id);
    }

    async salvarCartao(cartao: any, clienteId: number) {
        const dao = this.daos.get('CartaoCredito');
        if (!dao) throw new Error('DAO de CartaoCredito não encontrada');
        return (dao as any).salvar(cartao, clienteId);
    }

    async consultarCartao(id: number) {
        const dao = this.daos.get('CartaoCredito');
        if (!dao) throw new Error('DAO de CartaoCredito não encontrada');
        return dao.consultar(id);
    }

    async alterarCartao(cartao: any) {
        const dao = this.daos.get('CartaoCredito');
        if (!dao) throw new Error('DAO de CartaoCredito não encontrada');
        return dao.alterar(cartao);
    }

    async excluirCartao(id: number) {
        const dao = this.daos.get('CartaoCredito');
        if (!dao) throw new Error('DAO de CartaoCredito não encontrada');
        return dao.excluir(id);
    }
} 