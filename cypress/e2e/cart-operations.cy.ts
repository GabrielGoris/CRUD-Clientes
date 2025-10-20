/// <reference types="cypress" />

describe('Operações do Carrinho de Compras', () => {
  beforeEach(() => {
    // Limpar dados de teste antes de cada teste
    cy.cleanupTestData()
    
    // Visitar a página inicial
    cy.visit('/')
    
    // Aguardar a página carregar
    cy.get('[data-testid="product-list"]').should('be.visible')
  })

  describe('Adicionar itens ao carrinho', () => {
    it('deve adicionar um produto ao carrinho', () => {
      // Adicionar primeiro produto ao carrinho
      cy.get('[data-testid="product-1"]').within(() => {
        cy.get('[data-testid="add-to-cart-btn"]').click()
      })

      // Verificar se o produto foi adicionado
      cy.checkCartContains('product-1', 1)
      
      // Verificar se o ícone do carrinho mostra a quantidade
      cy.get('[data-testid="cart-icon"]').should('contain', '1')
      
      // Verificar se aparece mensagem de sucesso
      cy.get('[data-testid="success-message"]').should('contain', 'Produto adicionado ao carrinho')
    })

    it('deve adicionar múltiplos produtos ao carrinho', () => {
      // Adicionar primeiro produto
      cy.get('[data-testid="product-1"]').within(() => {
        cy.get('[data-testid="add-to-cart-btn"]').click()
      })

      // Adicionar segundo produto
      cy.get('[data-testid="product-2"]').within(() => {
        cy.get('[data-testid="add-to-cart-btn"]').click()
      })

      // Verificar se ambos os produtos estão no carrinho
      cy.checkCartContains('product-1', 1)
      cy.checkCartContains('product-2', 1)
      
      // Verificar se o ícone do carrinho mostra a quantidade total
      cy.get('[data-testid="cart-icon"]').should('contain', '2')
    })

    it('deve incrementar quantidade quando produto já existe no carrinho', () => {
      // Adicionar produto pela primeira vez
      cy.get('[data-testid="product-1"]').within(() => {
        cy.get('[data-testid="add-to-cart-btn"]').click()
      })

      // Adicionar o mesmo produto novamente
      cy.get('[data-testid="product-1"]').within(() => {
        cy.get('[data-testid="add-to-cart-btn"]').click()
      })

      // Verificar se a quantidade foi incrementada
      cy.checkCartContains('product-1', 2)
      
      // Verificar se o ícone do carrinho mostra a quantidade correta
      cy.get('[data-testid="cart-icon"]').should('contain', '2')
    })
  })

  describe('Alterar quantidade de itens no carrinho', () => {
    beforeEach(() => {
      // Adicionar produto ao carrinho antes dos testes
      cy.addToCart('product-1', 2)
      
      // Abrir o carrinho
      cy.get('[data-testid="cart-icon"]').click()
      cy.get('[data-testid="cart-modal"]').should('be.visible')
    })

    it('deve aumentar a quantidade de um item', () => {
      // Encontrar o item no carrinho e aumentar quantidade
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="increase-quantity-btn"]').click()
      })

      // Verificar se a quantidade foi aumentada
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="item-quantity"]').should('contain', '3')
      })

      // Verificar se o total foi atualizado
      cy.get('[data-testid="cart-total"]').should('contain', 'R$ 150,00')
    })

    it('deve diminuir a quantidade de um item', () => {
      // Encontrar o item no carrinho e diminuir quantidade
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="decrease-quantity-btn"]').click()
      })

      // Verificar se a quantidade foi diminuída
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="item-quantity"]').should('contain', '1')
      })

      // Verificar se o total foi atualizado
      cy.get('[data-testid="cart-total"]').should('contain', 'R$ 50,00')
    })

    it('deve permitir editar quantidade manualmente', () => {
      // Encontrar o campo de quantidade e alterar diretamente
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="quantity-input"]').clear().type('5')
        cy.get('[data-testid="quantity-input"]').blur()
      })

      // Verificar se a quantidade foi alterada
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="item-quantity"]').should('contain', '5')
      })

      // Verificar se o total foi atualizado
      cy.get('[data-testid="cart-total"]').should('contain', 'R$ 250,00')
    })

    it('deve validar quantidade mínima', () => {
      // Tentar diminuir quantidade para zero
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="decrease-quantity-btn"]').click()
        cy.get('[data-testid="decrease-quantity-btn"]').click()
      })

      // Verificar se o item foi removido do carrinho
      cy.get('[data-testid="cart-item-product-1"]').should('not.exist')
      
      // Verificar se o carrinho está vazio
      cy.get('[data-testid="empty-cart-message"]').should('be.visible')
    })
  })

  describe('Remover itens do carrinho', () => {
    beforeEach(() => {
      // Adicionar múltiplos produtos ao carrinho
      cy.addToCart('product-1', 2)
      cy.addToCart('product-2', 1)
      
      // Abrir o carrinho
      cy.get('[data-testid="cart-icon"]').click()
      cy.get('[data-testid="cart-modal"]').should('be.visible')
    })

    it('deve remover um item específico do carrinho', () => {
      // Remover o primeiro produto
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="remove-item-btn"]').click()
      })

      // Confirmar remoção no modal de confirmação
      cy.get('[data-testid="confirm-removal-btn"]').click()

      // Verificar se o item foi removido
      cy.get('[data-testid="cart-item-product-1"]').should('not.exist')
      
      // Verificar se o outro item ainda está presente
      cy.get('[data-testid="cart-item-product-2"]').should('exist')
      
      // Verificar se o total foi atualizado
      cy.get('[data-testid="cart-total"]').should('contain', 'R$ 75,00')
    })

    it('deve limpar todo o carrinho', () => {
      // Clicar no botão de limpar carrinho
      cy.get('[data-testid="clear-cart-btn"]').click()

      // Confirmar limpeza no modal de confirmação
      cy.get('[data-testid="confirm-clear-btn"]').click()

      // Verificar se todos os itens foram removidos
      cy.get('[data-testid="cart-item-product-1"]').should('not.exist')
      cy.get('[data-testid="cart-item-product-2"]').should('not.exist')
      
      // Verificar se aparece mensagem de carrinho vazio
      cy.get('[data-testid="empty-cart-message"]').should('be.visible')
      
      // Verificar se o ícone do carrinho mostra zero
      cy.get('[data-testid="cart-icon"]').should('contain', '0')
    })

    it('deve cancelar remoção quando usuário clica em cancelar', () => {
      // Tentar remover um item
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="remove-item-btn"]').click()
      })

      // Cancelar remoção
      cy.get('[data-testid="cancel-removal-btn"]').click()

      // Verificar se o item ainda está no carrinho
      cy.get('[data-testid="cart-item-product-1"]').should('exist')
      
      // Verificar se o total não foi alterado
      cy.get('[data-testid="cart-total"]').should('contain', 'R$ 125,00')
    })
  })

  describe('Validações do carrinho', () => {
    it('deve mostrar mensagem quando carrinho está vazio', () => {
      // Abrir carrinho vazio
      cy.get('[data-testid="cart-icon"]').click()
      
      // Verificar mensagem de carrinho vazio
      cy.get('[data-testid="empty-cart-message"]').should('be.visible')
      cy.get('[data-testid="empty-cart-message"]').should('contain', 'Seu carrinho está vazio')
      
      // Verificar se botão de continuar comprando está presente
      cy.get('[data-testid="continue-shopping-btn"]').should('be.visible')
    })

    it('deve calcular total corretamente com múltiplos itens', () => {
      // Adicionar produtos com preços diferentes
      cy.addToCart('product-1', 2) // R$ 50,00 cada
      cy.addToCart('product-2', 1) // R$ 75,00 cada
      cy.addToCart('product-3', 3) // R$ 30,00 cada
      
      // Abrir carrinho
      cy.get('[data-testid="cart-icon"]').click()
      
      // Verificar cálculo do total
      // Total esperado: (2 * 50) + (1 * 75) + (3 * 30) = 100 + 75 + 90 = 265
      cy.get('[data-testid="cart-total"]').should('contain', 'R$ 265,00')
      
      // Verificar subtotal de cada item
      cy.get('[data-testid="cart-item-product-1"]').within(() => {
        cy.get('[data-testid="item-subtotal"]').should('contain', 'R$ 100,00')
      })
      
      cy.get('[data-testid="cart-item-product-2"]').within(() => {
        cy.get('[data-testid="item-subtotal"]').should('contain', 'R$ 75,00')
      })
      
      cy.get('[data-testid="cart-item-product-3"]').within(() => {
        cy.get('[data-testid="item-subtotal"]').should('contain', 'R$ 90,00')
      })
    })

    it('deve persistir carrinho entre sessões', () => {
      // Adicionar produtos ao carrinho
      cy.addToCart('product-1', 2)
      cy.addToCart('product-2', 1)
      
      // Recarregar a página
      cy.reload()
      
      // Verificar se os produtos ainda estão no carrinho
      cy.checkCartContains('product-1', 2)
      cy.checkCartContains('product-2', 1)
      
      // Verificar se o ícone do carrinho mostra a quantidade correta
      cy.get('[data-testid="cart-icon"]').should('contain', '3')
    })
  })
})
