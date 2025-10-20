/// <reference types="cypress" />

describe('Consulta de Pedidos', () => {
  let testOrderId: string

  beforeEach(() => {
    // Limpar dados de teste
    cy.cleanupTestData()
    
    // Criar pedido de teste
    cy.createTestProduct({
      nome: 'Produto Teste',
      preco: 100.00,
      estoque: 10,
      categoria: 'Teste',
      descricao: 'Produto para teste de consulta'
    })
    
    cy.createTestClient({
      nome: 'Cliente Teste',
      email: 'teste@email.com',
      cpf: '12345678901',
      dataNascimento: '1990-01-01',
      telefone: '11999999999'
    })
    
    // Criar pedido via API
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/api/pedidos',
      body: {
        clienteId: 1,
        produtos: [
          { produtoId: 'product-1', quantidade: 2, preco: 100.00 }
        ],
        enderecoId: 1,
        formaPagamento: 'CARTAO_CREDITO',
        cartaoId: 1,
        total: 200.00,
        status: 'EM_ABERTO'
      }
    }).then((response) => {
      testOrderId = response.body.id
    })
  })

  describe('Busca de Pedido por ID', () => {
    it('deve encontrar pedido existente por ID', () => {
      // Navegar para página de consulta
      cy.visit('/pedidos/consulta')
      
      // Buscar pedido por ID
      cy.searchOrder(testOrderId)
      
      // Verificar se pedido foi encontrado
      cy.get('[data-testid="order-details"]').should('be.visible')
      cy.get('[data-testid="order-id"]').should('contain', testOrderId)
      cy.get('[data-testid="order-status"]').should('contain', 'EM ABERTO')
      cy.get('[data-testid="order-total"]').should('contain', 'R$ 200,00')
    })

    it('deve exibir informações completas do pedido', () => {
      // Buscar pedido
      cy.visit('/pedidos/consulta')
      cy.searchOrder(testOrderId)
      
      // Verificar informações do cliente
      cy.get('[data-testid="client-info"]').should('contain', 'Cliente Teste')
      cy.get('[data-testid="client-info"]').should('contain', 'teste@email.com')
      
      // Verificar produtos do pedido
      cy.get('[data-testid="order-items"]').should('be.visible')
      cy.get('[data-testid="order-item"]').should('contain', 'Produto Teste')
      cy.get('[data-testid="order-item"]').should('contain', 'Quantidade: 2')
      cy.get('[data-testid="order-item"]').should('contain', 'R$ 100,00')
      
      // Verificar endereço de entrega
      cy.get('[data-testid="delivery-address"]').should('be.visible')
      
      // Verificar forma de pagamento
      cy.get('[data-testid="payment-method"]').should('contain', 'Cartão de Crédito')
      
      // Verificar datas
      cy.get('[data-testid="order-date"]').should('be.visible')
      cy.get('[data-testid="order-date"]').should('contain', new Date().toLocaleDateString('pt-BR'))
    })

    it('deve exibir histórico de status do pedido', () => {
      // Buscar pedido
      cy.visit('/pedidos/consulta')
      cy.searchOrder(testOrderId)
      
      // Verificar histórico de status
      cy.get('[data-testid="status-history"]').should('be.visible')
      cy.get('[data-testid="status-item"]').should('contain', 'EM ABERTO')
      cy.get('[data-testid="status-item"]').should('contain', 'Pedido criado')
      
      // Simular mudança de status
      cy.request({
        method: 'PUT',
        url: `http://localhost:3000/api/pedidos/${testOrderId}`,
        body: { status: 'PROCESSANDO' }
      })
      
      // Recarregar página e verificar novo status
      cy.reload()
      cy.get('[data-testid="status-item"]').should('contain', 'PROCESSANDO')
    })

    it('deve mostrar erro para pedido inexistente', () => {
      // Buscar pedido inexistente
      cy.visit('/pedidos/consulta')
      cy.searchOrder('PEDIDO_INEXISTENTE')
      
      // Verificar mensagem de erro
      cy.get('[data-testid="order-not-found"]').should('be.visible')
      cy.get('[data-testid="order-not-found"]').should('contain', 'Pedido não encontrado')
      
      // Verificar se botão de nova busca está disponível
      cy.get('[data-testid="new-search-btn"]').should('be.visible')
    })

    it('deve validar formato do ID do pedido', () => {
      // Tentar buscar com ID inválido
      cy.visit('/pedidos/consulta')
      cy.get('[data-testid="order-search-input"]').type('ID_INVALIDO')
      cy.get('[data-testid="search-order-btn"]').click()
      
      // Verificar mensagem de erro
      cy.get('[data-testid="invalid-id-error"]').should('contain', 'ID do pedido inválido')
    })
  })

  describe('Listagem de Pedidos do Cliente', () => {
    beforeEach(() => {
      // Criar múltiplos pedidos para o mesmo cliente
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/pedidos',
        body: {
          clienteId: 1,
          produtos: [{ produtoId: 'product-1', quantidade: 1, preco: 100.00 }],
          enderecoId: 1,
          formaPagamento: 'CARTAO_CREDITO',
          cartaoId: 1,
          total: 100.00,
          status: 'ENTREGUE'
        }
      })
      
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/pedidos',
        body: {
          clienteId: 1,
          produtos: [{ produtoId: 'product-1', quantidade: 3, preco: 100.00 }],
          enderecoId: 1,
          formaPagamento: 'CARTAO_CREDITO',
          cartaoId: 1,
          total: 300.00,
          status: 'CANCELADO'
        }
      })
    })

    it('deve listar todos os pedidos do cliente', () => {
      // Navegar para página de pedidos do cliente
      cy.visit('/pedidos/cliente/1')
      
      // Verificar se lista de pedidos é exibida
      cy.get('[data-testid="orders-list"]').should('be.visible')
      cy.get('[data-testid="order-item"]').should('have.length', 3)
      
      // Verificar informações básicas de cada pedido
      cy.get('[data-testid="order-item"]').first().within(() => {
        cy.get('[data-testid="order-id"]').should('be.visible')
        cy.get('[data-testid="order-date"]').should('be.visible')
        cy.get('[data-testid="order-total"]').should('be.visible')
        cy.get('[data-testid="order-status"]').should('be.visible')
      })
    })

    it('deve filtrar pedidos por status', () => {
      // Navegar para página de pedidos
      cy.visit('/pedidos/cliente/1')
      
      // Filtrar por status "EM ABERTO"
      cy.get('[data-testid="status-filter"]').select('EM_ABERTO')
      
      // Verificar se apenas pedidos com status selecionado são exibidos
      cy.get('[data-testid="order-item"]').should('have.length', 1)
      cy.get('[data-testid="order-status"]').should('contain', 'EM ABERTO')
      
      // Filtrar por status "ENTREGUE"
      cy.get('[data-testid="status-filter"]').select('ENTREGUE')
      cy.get('[data-testid="order-item"]').should('have.length', 1)
      cy.get('[data-testid="order-status"]').should('contain', 'ENTREGUE')
    })

    it('deve filtrar pedidos por período', () => {
      // Navegar para página de pedidos
      cy.visit('/pedidos/cliente/1')
      
      // Filtrar por período
      cy.get('[data-testid="date-from"]').type('2024-01-01')
      cy.get('[data-testid="date-to"]').type('2024-12-31')
      cy.get('[data-testid="apply-date-filter"]').click()
      
      // Verificar se filtro foi aplicado
      cy.get('[data-testid="order-item"]').should('have.length', 3)
      
      // Filtrar por período sem pedidos
      cy.get('[data-testid="date-from"]').clear().type('2023-01-01')
      cy.get('[data-testid="date-to"]').clear().type('2023-12-31')
      cy.get('[data-testid="apply-date-filter"]').click()
      
      // Verificar mensagem de nenhum pedido encontrado
      cy.get('[data-testid="no-orders-message"]').should('contain', 'Nenhum pedido encontrado')
    })

    it('deve ordenar pedidos por data', () => {
      // Navegar para página de pedidos
      cy.visit('/pedidos/cliente/1')
      
      // Ordenar por data decrescente (mais recente primeiro)
      cy.get('[data-testid="sort-by-date"]').click()
      
      // Verificar ordenação
      cy.get('[data-testid="order-item"]').first().should('contain', testOrderId)
      
      // Ordenar por data crescente (mais antigo primeiro)
      cy.get('[data-testid="sort-by-date"]').click()
      
      // Verificar nova ordenação
      cy.get('[data-testid="order-item"]').last().should('contain', testOrderId)
    })

    it('deve ordenar pedidos por valor', () => {
      // Navegar para página de pedidos
      cy.visit('/pedidos/cliente/1')
      
      // Ordenar por valor decrescente (maior valor primeiro)
      cy.get('[data-testid="sort-by-value"]').click()
      
      // Verificar ordenação
      cy.get('[data-testid="order-item"]').first().should('contain', 'R$ 300,00')
      cy.get('[data-testid="order-item"]').last().should('contain', 'R$ 100,00')
    })
  })

  describe('Detalhes do Pedido', () => {
    it('deve exibir detalhes completos ao clicar em um pedido', () => {
      // Navegar para lista de pedidos
      cy.visit('/pedidos/cliente/1')
      
      // Clicar no primeiro pedido
      cy.get('[data-testid="order-item"]').first().click()
      
      // Verificar se modal de detalhes foi aberto
      cy.get('[data-testid="order-details-modal"]').should('be.visible')
      
      // Verificar informações detalhadas
      cy.get('[data-testid="order-details-modal"]').within(() => {
        cy.get('[data-testid="order-id"]').should('be.visible')
        cy.get('[data-testid="order-status"]').should('be.visible')
        cy.get('[data-testid="order-total"]').should('be.visible')
        cy.get('[data-testid="client-info"]').should('be.visible')
        cy.get('[data-testid="order-items"]').should('be.visible')
        cy.get('[data-testid="delivery-address"]').should('be.visible')
        cy.get('[data-testid="payment-method"]').should('be.visible')
      })
    })

    it('deve permitir fechar modal de detalhes', () => {
      // Abrir modal de detalhes
      cy.visit('/pedidos/cliente/1')
      cy.get('[data-testid="order-item"]').first().click()
      
      // Fechar modal
      cy.get('[data-testid="close-modal-btn"]').click()
      
      // Verificar se modal foi fechado
      cy.get('[data-testid="order-details-modal"]').should('not.exist')
    })

    it('deve exibir rastreamento do pedido', () => {
      // Atualizar status do pedido para "EM_TRANSITO"
      cy.request({
        method: 'PUT',
        url: `http://localhost:3000/api/pedidos/${testOrderId}`,
        body: { status: 'EM_TRANSITO' }
      })
      
      // Buscar pedido
      cy.visit('/pedidos/consulta')
      cy.searchOrder(testOrderId)
      
      // Verificar informações de rastreamento
      cy.get('[data-testid="tracking-info"]').should('be.visible')
      cy.get('[data-testid="tracking-status"]').should('contain', 'EM TRÂNSITO')
      cy.get('[data-testid="tracking-code"]').should('be.visible')
      
      // Verificar histórico de rastreamento
      cy.get('[data-testid="tracking-history"]').should('be.visible')
      cy.get('[data-testid="tracking-step"]').should('contain', 'Pedido enviado')
    })
  })

  describe('Ações do Pedido', () => {
    it('deve permitir cancelar pedido em aberto', () => {
      // Buscar pedido
      cy.visit('/pedidos/consulta')
      cy.searchOrder(testOrderId)
      
      // Clicar em cancelar pedido
      cy.get('[data-testid="cancel-order-btn"]').click()
      
      // Confirmar cancelamento
      cy.get('[data-testid="confirm-cancel-btn"]').click()
      
      // Verificar mensagem de sucesso
      cy.get('[data-testid="success-message"]').should('contain', 'Pedido cancelado com sucesso')
      
      // Verificar se status foi atualizado
      cy.get('[data-testid="order-status"]').should('contain', 'CANCELADO')
      
      // Verificar se estoque foi restaurado
      cy.request('GET', 'http://localhost:3000/api/produtos/product-1').then((response) => {
        expect(response.body.estoque).to.equal(10) // Estoque original
      })
    })

    it('deve impedir cancelamento de pedido já processado', () => {
      // Atualizar status para "PROCESSANDO"
      cy.request({
        method: 'PUT',
        url: `http://localhost:3000/api/pedidos/${testOrderId}`,
        body: { status: 'PROCESSANDO' }
      })
      
      // Buscar pedido
      cy.visit('/pedidos/consulta')
      cy.searchOrder(testOrderId)
      
      // Verificar se botão de cancelar não está disponível
      cy.get('[data-testid="cancel-order-btn"]').should('not.exist')
      
      // Verificar mensagem informativa
      cy.get('[data-testid="cancel-info"]').should('contain', 'Pedido não pode ser cancelado')
    })

    it('deve permitir imprimir comprovante', () => {
      // Buscar pedido
      cy.visit('/pedidos/consulta')
      cy.searchOrder(testOrderId)
      
      // Interceptar requisição de impressão
      cy.intercept('GET', `http://localhost:3000/api/pedidos/${testOrderId}/comprovante`).as('printReceipt')
      
      // Clicar em imprimir comprovante
      cy.get('[data-testid="print-receipt-btn"]').click()
      
      // Verificar se requisição foi feita
      cy.wait('@printReceipt')
      
      // Verificar se PDF foi gerado
      cy.get('[data-testid="pdf-viewer"]').should('be.visible')
    })

    it('deve permitir reenviar email de confirmação', () => {
      // Buscar pedido
      cy.visit('/pedidos/consulta')
      cy.searchOrder(testOrderId)
      
      // Interceptar requisição de email
      cy.intercept('POST', 'http://localhost:3000/api/emails/reenviar').as('resendEmail')
      
      // Clicar em reenviar email
      cy.get('[data-testid="resend-email-btn"]').click()
      
      // Verificar se email foi reenviado
      cy.wait('@resendEmail').then((interception) => {
        expect(interception.request.body).to.have.property('pedidoId', testOrderId)
      })
      
      // Verificar mensagem de sucesso
      cy.get('[data-testid="success-message"]').should('contain', 'Email reenviado com sucesso')
    })
  })

  describe('Relatórios e Estatísticas', () => {
    it('deve exibir estatísticas do cliente', () => {
      // Navegar para página de pedidos do cliente
      cy.visit('/pedidos/cliente/1')
      
      // Verificar estatísticas
      cy.get('[data-testid="client-stats"]').should('be.visible')
      cy.get('[data-testid="total-orders"]').should('contain', '3')
      cy.get('[data-testid="total-spent"]').should('contain', 'R$ 600,00')
      cy.get('[data-testid="average-order-value"]').should('contain', 'R$ 200,00')
    })

    it('deve exibir gráfico de pedidos por período', () => {
      // Navegar para página de relatórios
      cy.visit('/pedidos/relatorios')
      
      // Verificar se gráfico é exibido
      cy.get('[data-testid="orders-chart"]').should('be.visible')
      
      // Verificar se dados são carregados
      cy.get('[data-testid="chart-data"]').should('be.visible')
    })
  })
})
