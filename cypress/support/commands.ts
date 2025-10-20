/// <reference types="cypress" />

// Comandos customizados para os testes

// Comando para criar um cliente de teste
Cypress.Commands.add('createTestClient', (clientData) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/clientes',
    body: clientData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

// Comando para criar um produto de teste
Cypress.Commands.add('createTestProduct', (productData) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/produtos',
    body: productData,
    headers: {
      'Content-Type': 'application/json'
    }
  })
})

// Comando para limpar dados de teste
Cypress.Commands.add('cleanupTestData', () => {
  // Limpar carrinho
  cy.window().then((win) => {
    win.localStorage.removeItem('cart')
  })
  
  // Limpar dados de pedidos de teste
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:3000/api/test/cleanup'
  }).catch(() => {
    // Ignorar erro se o endpoint não existir
  })
})

// Comando para adicionar produto ao carrinho
Cypress.Commands.add('addToCart', (productId, quantity = 1) => {
  cy.window().then((win) => {
    const cart = JSON.parse(win.localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item.productId === productId)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ productId, quantity })
    }
    
    win.localStorage.setItem('cart', JSON.stringify(cart))
  })
})

// Comando para verificar se produto está no carrinho
Cypress.Commands.add('checkCartContains', (productId, expectedQuantity) => {
  cy.window().then((win) => {
    const cart = JSON.parse(win.localStorage.getItem('cart') || '[]')
    const item = cart.find(item => item.productId === productId)
    
    if (expectedQuantity === 0) {
      expect(item).to.be.undefined
    } else {
      expect(item).to.exist
      expect(item.quantity).to.equal(expectedQuantity)
    }
  })
})

// Comando para aplicar cupom
Cypress.Commands.add('applyCoupon', (couponCode) => {
  cy.get('[data-testid="coupon-input"]').type(couponCode)
  cy.get('[data-testid="apply-coupon-btn"]').click()
})

// Comando para selecionar cartão de crédito
Cypress.Commands.add('selectCreditCard', (cardId) => {
  cy.get(`[data-testid="credit-card-${cardId}"]`).click()
})

// Comando para preencher dados de novo cartão
Cypress.Commands.add('fillNewCreditCard', (cardData) => {
  cy.get('[data-testid="card-number"]').type(cardData.number)
  cy.get('[data-testid="card-name"]').type(cardData.name)
  cy.get('[data-testid="card-expiry"]').type(cardData.expiry)
  cy.get('[data-testid="card-cvv"]').type(cardData.cvv)
  cy.get('[data-testid="card-brand"]').select(cardData.brand)
})

// Comando para selecionar endereço de entrega
Cypress.Commands.add('selectDeliveryAddress', (addressId) => {
  cy.get(`[data-testid="address-${addressId}"]`).click()
})

// Comando para preencher novo endereço
Cypress.Commands.add('fillNewAddress', (addressData) => {
  cy.get('[data-testid="address-cep"]').type(addressData.cep)
  cy.get('[data-testid="address-street"]').type(addressData.street)
  cy.get('[data-testid="address-number"]').type(addressData.number)
  cy.get('[data-testid="address-neighborhood"]').type(addressData.neighborhood)
  cy.get('[data-testid="address-city"]').type(addressData.city)
  cy.get('[data-testid="address-state"]').type(addressData.state)
})

// Comando para finalizar pedido
Cypress.Commands.add('completeOrder', () => {
  cy.get('[data-testid="complete-order-btn"]').click()
})

// Comando para consultar pedido
Cypress.Commands.add('searchOrder', (orderId) => {
  cy.get('[data-testid="order-search-input"]').type(orderId)
  cy.get('[data-testid="search-order-btn"]').click()
})

// Declaração de tipos para TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      createTestClient(clientData: any): Chainable<void>
      createTestProduct(productData: any): Chainable<void>
      cleanupTestData(): Chainable<void>
      addToCart(productId: string, quantity?: number): Chainable<void>
      checkCartContains(productId: string, expectedQuantity: number): Chainable<void>
      applyCoupon(couponCode: string): Chainable<void>
      selectCreditCard(cardId: string): Chainable<void>
      fillNewCreditCard(cardData: any): Chainable<void>
      selectDeliveryAddress(addressId: string): Chainable<void>
      fillNewAddress(addressData: any): Chainable<void>
      completeOrder(): Chainable<void>
      searchOrder(orderId: string): Chainable<void>
    }
  }
}
