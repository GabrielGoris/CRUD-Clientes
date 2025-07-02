import { Router } from 'express';
import GenericController from './controller/GenericController';

const router = Router();
const controller = new GenericController();

router.post('/clientes', controller.salvar);
router.get('/clientes', controller.listar);
router.get('/clientes/:id', controller.consultar);
router.put('/clientes/:id', controller.alterar);
router.delete('/clientes/:id', controller.excluir);
router.get('/clientes/:id/enderecos', controller.listar);
router.get('/clientes/:id/cartoes', controller.listar);
router.post('/clientes/:id/enderecos', controller.salvarEndereco);
router.put('/enderecos/:id', controller.alterarEndereco);
router.delete('/enderecos/:id', controller.excluirEndereco);
router.post('/clientes/:id/cartoes', controller.salvarCartao);
router.put('/cartoes/:id', controller.alterarCartao);
router.delete('/cartoes/:id', controller.excluirCartao);
router.get('/enderecos/:id', controller.consultarEndereco);
router.get('/cartoes/:id', controller.consultarCartao);
router.post('/enderecos', controller.salvarEnderecoDireto);
router.get('/enderecos/cliente/:clienteId', controller.listarEnderecosPorCliente);
router.post('/cartoes', controller.salvarCartaoDireto);
router.get('/cartoes/cliente/:clienteId', controller.listarCartoesPorCliente);

export default router; 