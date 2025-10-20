/// <reference types="cypress" />

describe('Formas de Pagamento', () => {
  beforeEach(() => {
    // Limpar dados de teste
    cy.cleanupTestData()
    
    // Adicionar produtos ao carrinho para teste
    cy.addToCart('product-1', 2)
    cy.addToCart('product-2', 1)
    
    // Navegar para página de checkout
    cy.visit('/checkout')
    cy.get('[data-testid="checkout-page"]').should('be.visible')
  })

  describe('Cupons de Troca', () => {
    it('deve aplicar um cupom de troca válido', () => {
      // Aplicar cupom de troca
      cy.applyCoupon('TROCA50')
      
      // Verificar se o desconto foi aplicado
      cy.get('[data-testid="discount-amount"]').should('contain', 'R$ 50,00')
      cy.get('[data-testid="total-after-discount"]').should('contain', 'R$ 125,00')
      
      // Verificar se o cupom aparece na lista de cupons aplicados
      cy.get('[data-testid="applied-coupons"]').should('contain', 'TROCA50')
    })

    it('deve aplicar múltiplos cupons de troca', () => {
      // Aplicar primeiro cupom
      cy.applyCoupon('TROCA30')
      
      // Aplicar segundo cupom
      cy.applyCoupon('TROCA20')
      
      // Verificar se ambos os cupons foram aplicados
      cy.get('[data-testid="applied-coupons"]').should('contain', 'TROCA30')
      cy.get('[data-testid="applied-coupons"]').should('contain', 'TROCA20')
      
      // Verificar desconto total
      cy.get('[data-testid="discount-amount"]').should('contain', 'R$ 50,00')
    })

    it('deve rejeitar cupom de troca inválido', () => {
      // Tentar aplicar cupom inválido
      cy.applyCoupon('INVALIDO123')
      
      // Verificar mensagem de erro
      cy.get('[data-testid="coupon-error"]').should('be.visible')
      cy.get('[data-testid="coupon-error"]').should('contain', 'Cupom inválido ou expirado')
      
      // Verificar se nenhum desconto foi aplicado
      cy.get('[data-testid="discount-amount"]').should('contain', 'R$ 0,00')
    })

    it('deve rejeitar cupom de troca já utilizado', () => {
      // Aplicar cupom pela primeira vez
      cy.applyCoupon('TROCA50')
      
      // Tentar aplicar o mesmo cupom novamente
      cy.applyCoupon('TROCA50')
      
      // Verificar mensagem de erro
      cy.get('[data-testid="coupon-error"]').should('contain', 'Cupom já foi utilizado')
    })

    it('deve remover cupom de troca aplicado', () => {
      // Aplicar cupom
      cy.applyCoupon('TROCA50')
      
      // Remover cupom
      cy.get('[data-testid="remove-coupon-TROCA50"]').click()
      
      // Verificar se o cupom foi removido
      cy.get('[data-testid="applied-coupons"]').should('not.contain', 'TROCA50')
      
      // Verificar se o desconto foi removido
      cy.get('[data-testid="discount-amount"]').should('contain', 'R$ 0,00')
    })
  })

  describe('Cupons Promocionais', () => {
    it('deve aplicar um cupom promocional válido', () => {
      // Aplicar cupom promocional
      cy.applyCoupon('PROMO20')
      
      // Verificar se o desconto percentual foi aplicado
      cy.get('[data-testid="discount-amount"]').should('contain', 'R$ 35,00') // 20% de 175
      cy.get('[data-testid="total-after-discount"]').should('contain', 'R$ 140,00')
      
      // Verificar se o cupom aparece na lista
      cy.get('[data-testid="applied-coupons"]').should('contain', 'PROMO20')
    })

    it('deve aplicar apenas um cupom promocional', () => {
      // Aplicar primeiro cupom promocional
      cy.applyCoupon('PROMO20')
      
      // Tentar aplicar segundo cupom promocional
      cy.applyCoupon('PROMO15')
      
      // Verificar mensagem de erro
      cy.get('[data-testid="coupon-error"]').should('contain', 'Apenas um cupom promocional pode ser aplicado')
      
      // Verificar se apenas o primeiro cupom permanece
      cy.get('[data-testid="applied-coupons"]').should('contain', 'PROMO20')
      cy.get('[data-testid="applied-coupons"]').should('not.contain', 'PROMO15')
    })

    it('deve combinar cupom promocional com cupons de troca', () => {
      // Aplicar cupom de troca
      cy.applyCoupon('TROCA30')
      
      // Aplicar cupom promocional
      cy.applyCoupon('PROMO20')
      
      // Verificar se ambos foram aplicados
      cy.get('[data-testid="applied-coupons"]').should('contain', 'TROCA30')
      cy.get('[data-testid="applied-coupons"]').should('contain', 'PROMO20')
      
      // Verificar desconto total (30 + 20% de 145 = 30 + 29 = 59)
      cy.get('[data-testid="discount-amount"]').should('contain', 'R$ 59,00')
    })
  })

  describe('Cartões de Crédito', () => {
    beforeEach(() => {
      // Criar cliente de teste com cartões cadastrados
      cy.createTestClient({
        nome: 'Cliente Teste',
        email: 'teste@email.com',
        cpf: '12345678901',
        dataNascimento: '1990-01-01',
        telefone: '11999999999'
      }).then((response) => {
        const clientId = response.body.id
        
        // Criar cartões de teste
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/api/cartoes',
          body: {
            clienteId: clientId,
            numero: '4111111111111111',
            nomeTitular: 'Cliente Teste',
            dataValidade: '12/25',
            bandeira: 'VISA',
            cvv: '123'
          }
        })
        
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/api/cartoes',
          body: {
            clienteId: clientId,
            numero: '5555555555554444',
            nomeTitular: 'Cliente Teste',
            dataValidade: '12/26',
            bandeira: 'MASTERCARD',
            cvv: '456'
          }
        })
      })
    })

    it('deve selecionar um cartão já cadastrado', () => {
      // Selecionar cartão Visa
      cy.selectCreditCard('card-1')
      
      // Verificar se o cartão foi selecionado
      cy.get('[data-testid="selected-card"]').should('contain', '**** **** **** 1111')
      cy.get('[data-testid="selected-card"]').should('contain', 'VISA')
      
      // Verificar se o botão de finalizar pedido está habilitado
      cy.get('[data-testid="complete-order-btn"]').should('not.be.disabled')
    })

    it('deve cadastrar um novo cartão durante o pagamento', () => {
      // Selecionar opção de novo cartão
      cy.get('[data-testid="new-card-option"]').click()
      
      // Preencher dados do novo cartão
      cy.fillNewCreditCard({
        number: '4000000000000002',
        name: 'Novo Titular',
        expiry: '12/27',
        cvv: '789',
        brand: 'VISA'
      })
      
      // Verificar se o cartão foi cadastrado
      cy.get('[data-testid="card-success-message"]').should('contain', 'Cartão cadastrado com sucesso')
      
      // Verificar se o cartão foi selecionado automaticamente
      cy.get('[data-testid="selected-card"]').should('contain', '**** **** **** 0002')
    })

    it('deve validar dados do cartão antes de cadastrar', () => {
      // Selecionar opção de novo cartão
      cy.get('[data-testid="new-card-option"]').click()
      
      // Tentar cadastrar cartão com dados inválidos
      cy.fillNewCreditCard({
        number: '1234', // Número inválido
        name: '', // Nome vazio
        expiry: '13/25', // Mês inválido
        cvv: '12', // CVV inválido
        brand: 'VISA'
      })
      
      // Verificar mensagens de erro
      cy.get('[data-testid="card-number-error"]').should('contain', 'Número do cartão inválido')
      cy.get('[data-testid="card-name-error"]').should('contain', 'Nome do titular é obrigatório')
      cy.get('[data-testid="card-expiry-error"]').should('contain', 'Data de validade inválida')
      cy.get('[data-testid="card-cvv-error"]').should('contain', 'CVV inválido')
      
      // Verificar se o botão de cadastrar está desabilitado
      cy.get('[data-testid="register-card-btn"]').should('be.disabled')
    })

    it('deve permitir usar múltiplos cartões para pagamento', () => {
      // Selecionar primeiro cartão
      cy.selectCreditCard('card-1')
      
      // Definir valor para o primeiro cartão
      cy.get('[data-testid="card-amount-input"]').type('100')
      
      // Adicionar segundo cartão
      cy.get('[data-testid="add-another-card-btn"]').click()
      
      // Selecionar segundo cartão
      cy.selectCreditCard('card-2')
      
      // Definir valor para o segundo cartão
      cy.get('[data-testid="card-amount-input-2"]').type('75')
      
      // Verificar se o total está correto
      cy.get('[data-testid="total-card-amount"]').should('contain', 'R$ 175,00')
      
      // Verificar se ambos os cartões aparecem na lista
      cy.get('[data-testid="payment-summary"]').should('contain', 'VISA - R$ 100,00')
      cy.get('[data-testid="payment-summary"]').should('contain', 'MASTERCARD - R$ 75,00')
    })

    it('deve validar que a soma dos cartões seja igual ao total', () => {
      // Selecionar cartão
      cy.selectCreditCard('card-1')
      
      // Definir valor maior que o total
      cy.get('[data-testid="card-amount-input"]').type('200')
      
      // Verificar mensagem de erro
      cy.get('[data-testid="amount-error"]').should('contain', 'Valor excede o total do pedido')
      
      // Definir valor menor que o total
      cy.get('[data-testid="card-amount-input"]').clear().type('50')
      
      // Verificar mensagem de erro
      cy.get('[data-testid="amount-error"]').should('contain', 'Valor insuficiente para cobrir o total')
    })
  })

  describe('Combinação de Formas de Pagamento', () => {
    it('deve permitir combinar cupons e cartões de crédito', () => {
      // Aplicar cupom de desconto
      cy.applyCoupon('TROCA50')
      
      // Selecionar cartão
      cy.selectCreditCard('card-1')
      
      // Verificar se o valor do cartão foi ajustado automaticamente
      cy.get('[data-testid="card-amount-input"]').should('have.value', '125') // 175 - 50
      
      // Verificar resumo do pagamento
      cy.get('[data-testid="payment-summary"]').should('contain', 'Subtotal: R$ 175,00')
      cy.get('[data-testid="payment-summary"]').should('contain', 'Desconto: R$ 50,00')
      cy.get('[data-testid="payment-summary"]').should('contain', 'Total: R$ 125,00')
      cy.get('[data-testid="payment-summary"]').should('contain', 'Cartão: R$ 125,00')
    })

    it('deve calcular corretamente com múltiplos cartões e cupons', () => {
      // Aplicar cupom promocional
      cy.applyCoupon('PROMO20')
      
      // Selecionar primeiro cartão
      cy.selectCreditCard('card-1')
      cy.get('[data-testid="card-amount-input"]').type('100')
      
      // Adicionar segundo cartão
      cy.get('[data-testid="add-another-card-btn"]').click()
      cy.selectCreditCard('card-2')
      cy.get('[data-testid="card-amount-input-2"]').type('40')
      
      // Verificar cálculos
      cy.get('[data-testid="payment-summary"]').should('contain', 'Subtotal: R$ 175,00')
      cy.get('[data-testid="payment-summary"]').should('contain', 'Desconto: R$ 35,00')
      cy.get('[data-testid="payment-summary"]').should('contain', 'Total: R$ 140,00')
      cy.get('[data-testid="payment-summary"]').should('contain', 'Cartão 1: R$ 100,00')
      cy.get('[data-testid="payment-summary"]').should('contain', 'Cartão 2: R$ 40,00')
    })
  })

  describe('Validações de Pagamento', () => {
    it('deve impedir finalização sem forma de pagamento', () => {
      // Tentar finalizar sem selecionar cartão
      cy.get('[data-testid="complete-order-btn"]').should('be.disabled')
      
      // Verificar mensagem de aviso
      cy.get('[data-testid="payment-warning"]').should('contain', 'Selecione uma forma de pagamento')
    })

    it('deve validar cartão expirado', () => {
      // Selecionar cartão expirado
      cy.get('[data-testid="expired-card"]').click()
      
      // Verificar mensagem de erro
      cy.get('[data-testid="card-error"]').should('contain', 'Cartão expirado')
      
      // Verificar se o botão de finalizar está desabilitado
      cy.get('[data-testid="complete-order-btn"]').should('be.disabled')
    })

    it('deve validar limite do cartão', () => {
      // Selecionar cartão com limite insuficiente
      cy.get('[data-testid="low-limit-card"]').click()
      
      // Verificar mensagem de erro
      cy.get('[data-testid="card-error"]').should('contain', 'Limite insuficiente')
      
      // Verificar se o botão de finalizar está desabilitado
      cy.get('[data-testid="complete-order-btn"]').should('be.disabled')
    })
  })
})
