/// <reference types="cypress" />

describe('Criação de Pedido e Baixa de Estoque', () => {
  beforeEach(() => {
    // Limpar dados de teste
    cy.cleanupTestData()
    
    // Criar produtos de teste com estoque
    cy.createTestProduct({
      nome: 'Produto Teste 1',
      preco: 50.00,
      estoque: 10,
      categoria: 'Eletrônicos',
      descricao: 'Produto de teste para carrinho'
    })
    
    cy.createTestProduct({
      nome: 'Produto Teste 2',
      preco: 75.00,
      estoque: 5,
      categoria: 'Roupas',
      descricao: 'Segundo produto de teste'
    })
    
    cy.createTestProduct({
      nome: 'Produto Teste 3',
      preco: 30.00,
      estoque: 0, // Produto sem estoque
      categoria: 'Livros',
      descricao: 'Produto sem estoque'
    })
    
    // Criar cliente de teste
    cy.createTestClient({
      nome: 'Cliente Teste',
      email: 'teste@email.com',
      cpf: '12345678901',
      dataNascimento: '1990-01-01',
      telefone: '11999999999'
    })
    
    // Adicionar produtos ao carrinho
    cy.addToCart('product-1', 2)
    cy.addToCart('product-2', 1)
    
    // Navegar para checkout completo
    cy.visit('/checkout')
  })

  describe('Finalização do Pedido', () => {
    it('deve criar pedido com sucesso', () => {
      // Selecionar endereço de entrega
      cy.get('[data-testid="address-item"]').first().click()
      
      // Selecionar forma de pagamento
      cy.selectCreditCard('card-1')
      
      // Aplicar cupom de desconto
      cy.applyCoupon('TROCA50')
      
      // Finalizar pedido
      cy.completeOrder()
      
      // Verificar confirmação do pedido
      cy.get('[data-testid="order-confirmation"]').should('be.visible')
      cy.get('[data-testid="order-id"]').should('be.visible')
      cy.get('[data-testid="order-id"]').should('contain', 'Pedido #')
      
      // Verificar informações do pedido
      cy.get('[data-testid="order-summary"]').should('contain', 'Produto Teste 1')
      cy.get('[data-testid="order-summary"]').should('contain', 'Produto Teste 2')
      cy.get('[data-testid="order-summary"]').should('contain', 'R$ 125,00') // Total após desconto
      
      // Verificar status do pedido
      cy.get('[data-testid="order-status"]').should('contain', 'EM ABERTO')
    })

    it('deve gerar ID único para cada pedido', () => {
      // Finalizar primeiro pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Capturar ID do primeiro pedido
      cy.get('[data-testid="order-id"]').invoke('text').as('firstOrderId')
      
      // Voltar e criar segundo pedido
      cy.visit('/')
      cy.addToCart('product-1', 1)
      cy.visit('/checkout')
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar se os IDs são diferentes
      cy.get('[data-testid="order-id"]').invoke('text').then((secondOrderId) => {
        cy.get('@firstOrderId').then((firstOrderId) => {
          expect(firstOrderId).to.not.equal(secondOrderId)
        })
      })
    })

    it('deve definir status do pedido como EM ABERTO', () => {
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar status
      cy.get('[data-testid="order-status"]').should('contain', 'EM ABERTO')
      cy.get('[data-testid="order-status"]').should('have.class', 'status-open')
      
      // Verificar data de criação
      cy.get('[data-testid="order-date"]').should('be.visible')
      cy.get('[data-testid="order-date"]').should('contain', new Date().toLocaleDateString('pt-BR'))
    })

    it('deve enviar email de confirmação', () => {
      // Interceptar requisição de envio de email
      cy.intercept('POST', 'http://localhost:3000/api/emails/send').as('sendEmail')
      
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar se email foi enviado
      cy.wait('@sendEmail').then((interception) => {
        expect(interception.request.body).to.have.property('to', 'teste@email.com')
        expect(interception.request.body).to.have.property('subject', 'Confirmação de Pedido')
      })
      
      // Verificar mensagem de confirmação
      cy.get('[data-testid="email-confirmation"]').should('contain', 'Email de confirmação enviado')
    })
  })

  describe('Baixa de Estoque', () => {
    it('deve reduzir estoque dos produtos vendidos', () => {
      // Verificar estoque inicial
      cy.request('GET', 'http://localhost:3000/api/produtos/product-1').then((response) => {
        const initialStock = response.body.estoque
        expect(initialStock).to.equal(10)
      })
      
      cy.request('GET', 'http://localhost:3000/api/produtos/product-2').then((response) => {
        const initialStock = response.body.estoque
        expect(initialStock).to.equal(5)
      })
      
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar redução do estoque
      cy.request('GET', 'http://localhost:3000/api/produtos/product-1').then((response) => {
        const finalStock = response.body.estoque
        expect(finalStock).to.equal(8) // 10 - 2
      })
      
      cy.request('GET', 'http://localhost:3000/api/produtos/product-2').then((response) => {
        const finalStock = response.body.estoque
        expect(finalStock).to.equal(4) // 5 - 1
      })
    })

    it('deve impedir venda de produto sem estoque', () => {
      // Tentar adicionar produto sem estoque ao carrinho
      cy.visit('/')
      cy.get('[data-testid="product-3"]').within(() => {
        cy.get('[data-testid="add-to-cart-btn"]').should('be.disabled')
        cy.get('[data-testid="out-of-stock-message"]').should('contain', 'Produto indisponível')
      })
    })

    it('deve impedir finalização se estoque insuficiente', () => {
      // Adicionar quantidade maior que o estoque disponível
      cy.addToCart('product-2', 10) // Estoque disponível: 5
      
      // Tentar finalizar pedido
      cy.visit('/checkout')
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      
      // Verificar erro de estoque insuficiente
      cy.get('[data-testid="stock-error"]').should('contain', 'Estoque insuficiente')
      cy.get('[data-testid="complete-order-btn"]').should('be.disabled')
    })

    it('deve atualizar estoque em tempo real', () => {
      // Verificar estoque inicial na interface
      cy.get('[data-testid="product-stock-1"]').should('contain', '10 unidades')
      
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Voltar para lista de produtos
      cy.get('[data-testid="continue-shopping-btn"]').click()
      
      // Verificar se estoque foi atualizado na interface
      cy.get('[data-testid="product-stock-1"]').should('contain', '8 unidades')
    })

    it('deve registrar histórico de movimentação de estoque', () => {
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar histórico de movimentação
      cy.request('GET', 'http://localhost:3000/api/estoque/movimentacoes').then((response) => {
        const movimentacoes = response.body
        expect(movimentacoes).to.have.length.greaterThan(0)
        
        const movimentacaoProduto1 = movimentacoes.find(m => m.produtoId === 'product-1')
        expect(movimentacaoProduto1).to.exist
        expect(movimentacaoProduto1.tipo).to.equal('SAIDA')
        expect(movimentacaoProduto1.quantidade).to.equal(2)
        expect(movimentacaoProduto1.motivo).to.equal('VENDA')
      })
    })
  })

  describe('Validações de Pedido', () => {
    it('deve validar dados obrigatórios antes de finalizar', () => {
      // Tentar finalizar sem selecionar endereço
      cy.selectCreditCard('card-1')
      cy.get('[data-testid="complete-order-btn"]').should('be.disabled')
      cy.get('[data-testid="validation-error"]').should('contain', 'Selecione um endereço de entrega')
      
      // Selecionar endereço mas não cartão
      cy.get('[data-testid="address-item"]').first().click()
      cy.get('[data-testid="complete-order-btn"]').should('be.disabled')
      cy.get('[data-testid="validation-error"]').should('contain', 'Selecione uma forma de pagamento')
    })

    it('deve validar carrinho não vazio', () => {
      // Limpar carrinho
      cy.window().then((win) => {
        win.localStorage.removeItem('cart')
      })
      
      // Tentar acessar checkout com carrinho vazio
      cy.visit('/checkout')
      
      // Verificar redirecionamento
      cy.url().should('include', '/carrinho')
      cy.get('[data-testid="empty-cart-message"]').should('contain', 'Seu carrinho está vazio')
    })

    it('deve calcular total corretamente com descontos', () => {
      // Aplicar cupom
      cy.applyCoupon('TROCA50')
      
      // Verificar cálculos
      cy.get('[data-testid="subtotal"]').should('contain', 'R$ 175,00')
      cy.get('[data-testid="discount"]').should('contain', 'R$ 50,00')
      cy.get('[data-testid="delivery-fee"]').should('contain', 'R$ 15,00')
      cy.get('[data-testid="total"]').should('contain', 'R$ 140,00')
      
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar se total foi mantido na confirmação
      cy.get('[data-testid="order-total"]').should('contain', 'R$ 140,00')
    })

    it('deve validar dados do cliente', () => {
      // Tentar finalizar com cliente inativo
      cy.request({
        method: 'PUT',
        url: 'http://localhost:3000/api/clientes/1',
        body: { status: 'INATIVO' }
      })
      
      // Tentar finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar erro
      cy.get('[data-testid="client-error"]').should('contain', 'Cliente inativo')
    })
  })

  describe('Integração com Sistema de Pagamento', () => {
    it('deve processar pagamento com cartão válido', () => {
      // Interceptar requisição de pagamento
      cy.intercept('POST', 'http://localhost:3000/api/pagamentos/processar').as('processPayment')
      
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar processamento do pagamento
      cy.wait('@processPayment').then((interception) => {
        expect(interception.request.body).to.have.property('cartaoId')
        expect(interception.request.body).to.have.property('valor')
        expect(interception.request.body.valor).to.equal(140.00)
      })
      
      // Verificar confirmação de pagamento
      cy.get('[data-testid="payment-confirmation"]').should('contain', 'Pagamento aprovado')
    })

    it('deve tratar erro de pagamento', () => {
      // Interceptar e simular erro de pagamento
      cy.intercept('POST', 'http://localhost:3000/api/pagamentos/processar', {
        statusCode: 400,
        body: { error: 'Cartão recusado' }
      }).as('paymentError')
      
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar tratamento do erro
      cy.get('[data-testid="payment-error"]').should('contain', 'Pagamento recusado')
      cy.get('[data-testid="retry-payment-btn"]').should('be.visible')
      
      // Verificar se pedido não foi criado
      cy.get('[data-testid="order-confirmation"]').should('not.exist')
    })
  })

  describe('Notificações e Comunicação', () => {
    it('deve enviar notificação para administrador', () => {
      // Interceptar notificação
      cy.intercept('POST', 'http://localhost:3000/api/notificacoes').as('sendNotification')
      
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Verificar notificação enviada
      cy.wait('@sendNotification').then((interception) => {
        expect(interception.request.body).to.have.property('tipo', 'NOVO_PEDIDO')
        expect(interception.request.body).to.have.property('pedidoId')
      })
    })

    it('deve atualizar status em tempo real', () => {
      // Finalizar pedido
      cy.get('[data-testid="address-item"]').first().click()
      cy.selectCreditCard('card-1')
      cy.completeOrder()
      
      // Capturar ID do pedido
      cy.get('[data-testid="order-id"]').invoke('text').then((orderId) => {
        const id = orderId.replace('Pedido #', '')
        
        // Simular mudança de status pelo admin
        cy.request({
          method: 'PUT',
          url: `http://localhost:3000/api/pedidos/${id}`,
          body: { status: 'PROCESSANDO' }
        })
        
        // Verificar se status foi atualizado na interface
        cy.reload()
        cy.get('[data-testid="order-status"]').should('contain', 'PROCESSANDO')
      })
    })
  })
})
