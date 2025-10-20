/// <reference types="cypress" />

describe('Seleção e Cadastro de Endereço de Entrega', () => {
  beforeEach(() => {
    // Limpar dados de teste
    cy.cleanupTestData()
    
    // Criar cliente de teste com endereços cadastrados
    cy.createTestClient({
      nome: 'Cliente Teste',
      email: 'teste@email.com',
      cpf: '12345678901',
      dataNascimento: '1990-01-01',
      telefone: '11999999999'
    }).then((response) => {
      const clientId = response.body.id
      
      // Criar endereços de teste
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/enderecos',
        body: {
          clienteId: clientId,
          tipo: 'ENTREGA',
          cep: '01234567',
          logradouro: 'Rua das Flores',
          numero: '123',
          complemento: 'Apto 45',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP'
        }
      })
      
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/enderecos',
        body: {
          clienteId: clientId,
          tipo: 'ENTREGA',
          cep: '04567890',
          logradouro: 'Av. Paulista',
          numero: '1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP'
        }
      })
    })
    
    // Adicionar produtos ao carrinho
    cy.addToCart('product-1', 2)
    
    // Navegar para página de endereço
    cy.visit('/checkout/address')
    cy.get('[data-testid="address-selection-page"]').should('be.visible')
  })

  describe('Seleção de Endereço Existente', () => {
    it('deve exibir lista de endereços cadastrados', () => {
      // Verificar se os endereços são exibidos
      cy.get('[data-testid="address-list"]').should('be.visible')
      cy.get('[data-testid="address-item"]').should('have.length', 2)
      
      // Verificar dados do primeiro endereço
      cy.get('[data-testid="address-item"]').first().within(() => {
        cy.get('[data-testid="address-street"]').should('contain', 'Rua das Flores')
        cy.get('[data-testid="address-number"]').should('contain', '123')
        cy.get('[data-testid="address-complement"]').should('contain', 'Apto 45')
        cy.get('[data-testid="address-neighborhood"]').should('contain', 'Centro')
        cy.get('[data-testid="address-city"]').should('contain', 'São Paulo')
        cy.get('[data-testid="address-state"]').should('contain', 'SP')
        cy.get('[data-testid="address-zip"]').should('contain', '01234-567')
      })
    })

    it('deve selecionar um endereço existente', () => {
      // Selecionar primeiro endereço
      cy.get('[data-testid="address-item"]').first().click()
      
      // Verificar se o endereço foi selecionado
      cy.get('[data-testid="selected-address"]').should('contain', 'Rua das Flores, 123')
      cy.get('[data-testid="selected-address"]').should('contain', 'Centro - São Paulo/SP')
      
      // Verificar se o botão de continuar está habilitado
      cy.get('[data-testid="continue-btn"]').should('not.be.disabled')
    })

    it('deve permitir alterar seleção de endereço', () => {
      // Selecionar primeiro endereço
      cy.get('[data-testid="address-item"]').first().click()
      
      // Selecionar segundo endereço
      cy.get('[data-testid="address-item"]').last().click()
      
      // Verificar se a seleção foi alterada
      cy.get('[data-testid="selected-address"]').should('contain', 'Av. Paulista, 1000')
      cy.get('[data-testid="selected-address"]').should('contain', 'Bela Vista - São Paulo/SP')
    })

    it('deve exibir informações de entrega do endereço selecionado', () => {
      // Selecionar endereço
      cy.get('[data-testid="address-item"]').first().click()
      
      // Verificar informações de entrega
      cy.get('[data-testid="delivery-info"]').should('be.visible')
      cy.get('[data-testid="delivery-time"]').should('contain', '2-3 dias úteis')
      cy.get('[data-testid="delivery-fee"]').should('contain', 'R$ 15,00')
    })
  })

  describe('Cadastro de Novo Endereço', () => {
    it('deve abrir formulário de novo endereço', () => {
      // Clicar em adicionar novo endereço
      cy.get('[data-testid="add-new-address-btn"]').click()
      
      // Verificar se o formulário foi aberto
      cy.get('[data-testid="new-address-form"]').should('be.visible')
      
      // Verificar campos obrigatórios
      cy.get('[data-testid="address-cep"]').should('be.visible')
      cy.get('[data-testid="address-street"]').should('be.visible')
      cy.get('[data-testid="address-number"]').should('be.visible')
      cy.get('[data-testid="address-neighborhood"]').should('be.visible')
      cy.get('[data-testid="address-city"]').should('be.visible')
      cy.get('[data-testid="address-state"]').should('be.visible')
    })

    it('deve cadastrar novo endereço com sucesso', () => {
      // Abrir formulário
      cy.get('[data-testid="add-new-address-btn"]').click()
      
      // Preencher dados do endereço
      cy.fillNewAddress({
        cep: '09876543',
        street: 'Rua Nova',
        number: '456',
        neighborhood: 'Vila Nova',
        city: 'São Paulo',
        state: 'SP'
      })
      
      // Cadastrar endereço
      cy.get('[data-testid="save-address-btn"]').click()
      
      // Verificar mensagem de sucesso
      cy.get('[data-testid="success-message"]').should('contain', 'Endereço cadastrado com sucesso')
      
      // Verificar se o endereço aparece na lista
      cy.get('[data-testid="address-item"]').should('have.length', 3)
      cy.get('[data-testid="address-item"]').last().should('contain', 'Rua Nova, 456')
    })

    it('deve validar campos obrigatórios', () => {
      // Abrir formulário
      cy.get('[data-testid="add-new-address-btn"]').click()
      
      // Tentar salvar sem preencher campos
      cy.get('[data-testid="save-address-btn"]').click()
      
      // Verificar mensagens de erro
      cy.get('[data-testid="cep-error"]').should('contain', 'CEP é obrigatório')
      cy.get('[data-testid="street-error"]').should('contain', 'Logradouro é obrigatório')
      cy.get('[data-testid="number-error"]').should('contain', 'Número é obrigatório')
      cy.get('[data-testid="neighborhood-error"]').should('contain', 'Bairro é obrigatório')
      cy.get('[data-testid="city-error"]').should('contain', 'Cidade é obrigatória')
      cy.get('[data-testid="state-error"]').should('contain', 'Estado é obrigatório')
    })

    it('deve validar formato do CEP', () => {
      // Abrir formulário
      cy.get('[data-testid="add-new-address-btn"]').click()
      
      // Preencher CEP inválido
      cy.get('[data-testid="address-cep"]').type('123')
      
      // Verificar mensagem de erro
      cy.get('[data-testid="cep-error"]').should('contain', 'CEP deve ter 8 dígitos')
      
      // Preencher CEP válido
      cy.get('[data-testid="address-cep"]').clear().type('12345678')
      
      // Verificar se o erro foi removido
      cy.get('[data-testid="cep-error"]').should('not.exist')
    })

    it('deve buscar endereço pelo CEP', () => {
      // Abrir formulário
      cy.get('[data-testid="add-new-address-btn"]').click()
      
      // Preencher CEP
      cy.get('[data-testid="address-cep"]').type('01310100')
      
      // Aguardar busca automática
      cy.wait(1000)
      
      // Verificar se os campos foram preenchidos automaticamente
      cy.get('[data-testid="address-street"]').should('have.value', 'Av. Paulista')
      cy.get('[data-testid="address-neighborhood"]').should('have.value', 'Bela Vista')
      cy.get('[data-testid="address-city"]').should('have.value', 'São Paulo')
      cy.get('[data-testid="address-state"]').should('have.value', 'SP')
    })

    it('deve permitir cancelar cadastro de novo endereço', () => {
      // Abrir formulário
      cy.get('[data-testid="add-new-address-btn"]').click()
      
      // Preencher alguns campos
      cy.get('[data-testid="address-cep"]').type('12345678')
      cy.get('[data-testid="address-street"]').type('Rua Teste')
      
      // Cancelar cadastro
      cy.get('[data-testid="cancel-address-btn"]').click()
      
      // Verificar se o formulário foi fechado
      cy.get('[data-testid="new-address-form"]').should('not.exist')
      
      // Verificar se os dados não foram salvos
      cy.get('[data-testid="address-item"]').should('have.length', 2)
    })
  })

  describe('Edição de Endereço Existente', () => {
    it('deve abrir formulário de edição', () => {
      // Clicar em editar primeiro endereço
      cy.get('[data-testid="address-item"]').first().within(() => {
        cy.get('[data-testid="edit-address-btn"]').click()
      })
      
      // Verificar se o formulário foi aberto com dados preenchidos
      cy.get('[data-testid="edit-address-form"]').should('be.visible')
      cy.get('[data-testid="address-cep"]').should('have.value', '01234567')
      cy.get('[data-testid="address-street"]').should('have.value', 'Rua das Flores')
    })

    it('deve atualizar endereço existente', () => {
      // Editar primeiro endereço
      cy.get('[data-testid="address-item"]').first().within(() => {
        cy.get('[data-testid="edit-address-btn"]').click()
      })
      
      // Alterar dados
      cy.get('[data-testid="address-number"]').clear().type('999')
      cy.get('[data-testid="address-complement"]').clear().type('Sobrado')
      
      // Salvar alterações
      cy.get('[data-testid="save-address-btn"]').click()
      
      // Verificar mensagem de sucesso
      cy.get('[data-testid="success-message"]').should('contain', 'Endereço atualizado com sucesso')
      
      // Verificar se as alterações foram salvas
      cy.get('[data-testid="address-item"]').first().should('contain', 'Rua das Flores, 999')
      cy.get('[data-testid="address-item"]').first().should('contain', 'Sobrado')
    })

    it('deve excluir endereço existente', () => {
      // Excluir primeiro endereço
      cy.get('[data-testid="address-item"]').first().within(() => {
        cy.get('[data-testid="delete-address-btn"]').click()
      })
      
      // Confirmar exclusão
      cy.get('[data-testid="confirm-delete-btn"]').click()
      
      // Verificar mensagem de sucesso
      cy.get('[data-testid="success-message"]').should('contain', 'Endereço excluído com sucesso')
      
      // Verificar se o endereço foi removido da lista
      cy.get('[data-testid="address-item"]').should('have.length', 1)
    })

    it('deve cancelar exclusão de endereço', () => {
      // Tentar excluir endereço
      cy.get('[data-testid="address-item"]').first().within(() => {
        cy.get('[data-testid="delete-address-btn"]').click()
      })
      
      // Cancelar exclusão
      cy.get('[data-testid="cancel-delete-btn"]').click()
      
      // Verificar se o endereço ainda está na lista
      cy.get('[data-testid="address-item"]').should('have.length', 2)
    })
  })

  describe('Validações de Endereço', () => {
    it('deve impedir continuar sem selecionar endereço', () => {
      // Verificar se o botão de continuar está desabilitado
      cy.get('[data-testid="continue-btn"]').should('be.disabled')
      
      // Verificar mensagem de aviso
      cy.get('[data-testid="address-warning"]').should('contain', 'Selecione um endereço de entrega')
    })

    it('deve validar limite de endereços por cliente', () => {
      // Criar múltiplos endereços até atingir o limite
      for (let i = 0; i < 3; i++) {
        cy.get('[data-testid="add-new-address-btn"]').click()
        cy.fillNewAddress({
          cep: `1234567${i}`,
          street: `Rua ${i}`,
          number: `${i}00`,
          neighborhood: `Bairro ${i}`,
          city: 'São Paulo',
          state: 'SP'
        })
        cy.get('[data-testid="save-address-btn"]').click()
      }
      
      // Tentar adicionar mais um endereço
      cy.get('[data-testid="add-new-address-btn"]').click()
      
      // Verificar mensagem de limite atingido
      cy.get('[data-testid="limit-message"]').should('contain', 'Limite máximo de endereços atingido')
    })

    it('deve calcular frete baseado no endereço selecionado', () => {
      // Selecionar endereço
      cy.get('[data-testid="address-item"]').first().click()
      
      // Verificar cálculo do frete
      cy.get('[data-testid="delivery-fee"]').should('contain', 'R$ 15,00')
      cy.get('[data-testid="delivery-time"]').should('contain', '2-3 dias úteis')
      
      // Selecionar outro endereço
      cy.get('[data-testid="address-item"]').last().click()
      
      // Verificar se o frete foi recalculado
      cy.get('[data-testid="delivery-fee"]').should('contain', 'R$ 20,00')
      cy.get('[data-testid="delivery-time"]').should('contain', '3-4 dias úteis')
    })

    it('deve exibir endereço selecionado no resumo do pedido', () => {
      // Selecionar endereço
      cy.get('[data-testid="address-item"]').first().click()
      
      // Continuar para próxima etapa
      cy.get('[data-testid="continue-btn"]').click()
      
      // Verificar se o endereço aparece no resumo
      cy.get('[data-testid="order-summary"]').should('contain', 'Endereço de entrega')
      cy.get('[data-testid="order-summary"]').should('contain', 'Rua das Flores, 123')
      cy.get('[data-testid="order-summary"]').should('contain', 'Centro - São Paulo/SP')
    })
  })
})
