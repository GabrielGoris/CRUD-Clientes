import { Request, Response } from "express";
import GenericFacade from "../facade/GenericFacade";
import Cliente from "../domain/Cliente";
import Endereco from "../domain/Endereco";
import CartaoCredito from "../domain/CartaoCredito";

const facade = new GenericFacade<any>();

export default class GenericController {
  async salvar(req: Request, res: Response) {
    try {
      const cliente = new Cliente(
        req.body.nome,
        req.body.email,
        req.body.cpf,
        req.body.dataNascimento,
        [],
        [],
        req.body.telefone,
        req.body.status || "ATIVO",
        req.body.genero || "OUTROS"
      );

      const clienteCriado = await facade.salvar(cliente);
      res.json(clienteCriado);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const path = req.path.split("/")[1];
      const nomeEntidade = path.charAt(0).toUpperCase() + path.slice(1, -1);

      const idRelacional = req.params.id ? parseInt(req.params.id) : undefined;
      const subEntidadePath = req.path.split("/")[3];

      if (subEntidadePath) {
        const nomeSubEntidade =
          subEntidadePath.charAt(0).toUpperCase() +
          subEntidadePath.slice(1, -1);
        const entidades = await facade.listar(nomeSubEntidade, idRelacional);
        return res.json(entidades);
      }

      const entidades = await facade.listar(nomeEntidade, idRelacional);
      res.json(entidades);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async consultar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const path = req.path.split("/")[1];
      const nomeEntidade = path.charAt(0).toUpperCase() + path.slice(1, -1);

      const entidade = await facade.consultar(nomeEntidade, parseInt(id));
      if (entidade) {
        res.json(entidade);
      } else {
        res.status(404).json({ error: "Entidade não encontrada." });
      }
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async alterar(req: Request, res: Response) {
    try {
      const cliente = new Cliente(
        req.body.nome,
        req.body.email,
        req.body.cpf,
        req.body.dataNascimento,
        [],
        [],
        req.body.telefone,
        req.body.status || "ATIVO",
        req.body.genero || "OUTROS",
        parseInt(req.params.id)
      );

      const resultado = await facade.alterar(cliente);
      res.json({ message: resultado });
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const path = req.path.split("/")[1];
      const nomeEntidade = path.charAt(0).toUpperCase() + path.slice(1, -1);

      const resultado = await facade.excluir(nomeEntidade, parseInt(id));
      res.json({ message: resultado });
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  // Métodos para Endereço
  async salvarEndereco(req: Request, res: Response) {
    try {
      const clienteId = parseInt(req.params.id);
      const endereco = new Endereco(
        req.body.logradouro,
        req.body.numero,
        req.body.bairro,
        req.body.cidade,
        req.body.estado,
        req.body.cep,
        req.body.tipo
      );
      const resultado = await facade.salvarEndereco(endereco, clienteId);
      res.status(201).json(resultado);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }
  async alterarEndereco(req: Request, res: Response) {
    try {
      const endereco = new Endereco(
        req.body.logradouro,
        req.body.numero,
        req.body.bairro,
        req.body.cidade,
        req.body.estado,
        req.body.cep,
        req.body.tipo,
        parseInt(req.params.id)
      );
      const resultado = await facade.alterarEndereco(endereco);
      res.json(resultado);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }
  async excluirEndereco(req: Request, res: Response) {
    try {
      await facade.excluirEndereco(parseInt(req.params.id));
      res.json({});
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  //Métodos para CartaoCredito
  async salvarCartao(req: Request, res: Response) {
    try {
      const clienteId = parseInt(req.params.id);
      const cartao = new CartaoCredito(
        req.body.numero,
        req.body.nomeTitular,
        req.body.dataValidade,
        req.body.cvv
      );
      const resultado = await facade.salvarCartao(cartao, clienteId);
      res.status(201).json(resultado);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }
  async alterarCartao(req: Request, res: Response) {
    try {
      const cartao = new CartaoCredito(
        req.body.numero,
        req.body.nomeTitular,
        req.body.dataValidade,
        req.body.cvv,
        parseInt(req.params.id)
      );
      const resultado = await facade.alterarCartao(cartao);
      res.json(resultado);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }
  async excluirCartao(req: Request, res: Response) {
    try {
      await facade.excluirCartao(parseInt(req.params.id));
      res.json({});
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async consultarEndereco(req: Request, res: Response) {
    try {
      const endereco = await facade.consultarEndereco(parseInt(req.params.id));
      if (endereco) {
        res.json(endereco);
      } else {
        res.status(404).json({ error: "Endereço não encontrado." });
      }
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async consultarCartao(req: Request, res: Response) {
    try {
      const cartao = await facade.consultarCartao(parseInt(req.params.id));
      if (cartao) {
        res.json(cartao);
      } else {
        res.status(404).json({ error: "Cartão não encontrado." });
      }
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }

  async salvarEnderecoDireto(req: Request, res: Response) {
    try {
      const { clienteId } = req.body;
      const endereco = new Endereco(
        req.body.logradouro,
        req.body.numero,
        req.body.bairro,
        req.body.cidade,
        req.body.estado,
        req.body.cep,
        req.body.tipo
      );
      const resultado = await facade.salvarEndereco(endereco, clienteId);
      res.status(201).json(resultado);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }
  async listarEnderecosPorCliente(req: Request, res: Response) {
    try {
      const clienteId = parseInt(req.params.clienteId);
      const dao = facade["daos"].get("Endereco");
      if (!dao) {
        res.status(500).json({ error: "DAO de Endereco não encontrada" });
        return;
      }
      const enderecos = await (dao as any).listar(clienteId);
      res.json(enderecos);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }
  async salvarCartaoDireto(req: Request, res: Response) {
    try {
      const { clienteId } = req.body;
      const cartao = new CartaoCredito(
        req.body.numero,
        req.body.nomeTitular,
        req.body.dataValidade,
        req.body.cvv
      );
      const resultado = await facade.salvarCartao(cartao, clienteId);
      res.status(201).json(resultado);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }
  async listarCartoesPorCliente(req: Request, res: Response) {
    try {
      const clienteId = parseInt(req.params.clienteId);
      const dao = facade["daos"].get("CartaoCredito");
      if (!dao) {
        res.status(500).json({ error: "DAO de CartaoCredito não encontrada" });
        return;
      }
      const cartoes = await (dao as any).listar(clienteId);
      res.json(cartoes);
    } catch (e) {
      const err = e as Error;
      res.status(500).json({ error: err.message });
    }
  }
}
