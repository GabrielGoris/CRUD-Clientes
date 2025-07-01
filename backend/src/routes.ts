import { Router } from 'express';
import GenericController from './controllers/GenericController';

const router = Router();
const controller = new GenericController();

// Rota para salvar uma entidade (ex: cliente)
router.post('/clientes', controller.salvar);

// Rota para listar entidades (ex: clientes)
router.get('/clientes', controller.listar);

// Rota para consultar uma entidade por ID
router.get('/clientes/:id', controller.consultar);

// Rota para alterar uma entidade por ID
router.put('/clientes/:id', controller.alterar);

// Rota para excluir uma entidade por ID
router.delete('/clientes/:id', controller.excluir);

// --- Rotas de Sub-Entidades ---

// Listar endereços de um cliente
router.get('/clientes/:id/enderecos', controller.listar);

// Listar cartões de um cliente
router.get('/clientes/:id/cartoes', controller.listar);

// Salvar endereço para um cliente
router.post('/clientes/:id/enderecos', controller.salvarEndereco);

// Alterar endereço
router.put('/enderecos/:id', controller.alterarEndereco);

// Excluir endereço
router.delete('/enderecos/:id', controller.excluirEndereco);

// Salvar cartão para um cliente
router.post('/clientes/:id/cartoes', controller.salvarCartao);

// Alterar cartão
router.put('/cartoes/:id', controller.alterarCartao);

// Excluir cartão
router.delete('/cartoes/:id', controller.excluirCartao);

// Exibir endereço por id
router.get('/enderecos/:id', controller.consultarEndereco);

// Exibir cartão por id
router.get('/cartoes/:id', controller.consultarCartao);

// Criar endereço direto
router.post('/enderecos', controller.salvarEnderecoDireto);

// Listar endereços de um cliente
router.get('/enderecos/cliente/:clienteId', controller.listarEnderecosPorCliente);

// Criar cartão direto
router.post('/cartoes', controller.salvarCartaoDireto);

// Listar cartões de um cliente
router.get('/cartoes/cliente/:clienteId', controller.listarCartoesPorCliente);

export default router; 