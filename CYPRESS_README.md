# Testes E2E com Cypress - Sistema de Carrinho e Pagamento

Este projeto inclui uma suíte completa de testes end-to-end (E2E) usando Cypress para validar todas as funcionalidades do sistema de carrinho de compras e pagamento.

## 📋 Escopo dos Testes

Os testes cobrem os seguintes cenários:

### 🛒 Operações do Carrinho

- ✅ Adicionar produtos ao carrinho
- ✅ Remover produtos do carrinho
- ✅ Alterar quantidade de itens
- ✅ Calcular total corretamente
- ✅ Persistir carrinho entre sessões
- ✅ Validações de carrinho vazio

### 💳 Formas de Pagamento

- ✅ Aplicar cupons de troca (múltiplos)
- ✅ Aplicar cupons promocionais (único)
- ✅ Combinar cupons de troca e promocionais
- ✅ Usar cartões de crédito cadastrados
- ✅ Cadastrar novos cartões durante o pagamento
- ✅ Usar múltiplos cartões para pagamento
- ✅ Validações de cartão (expirado, limite, etc.)

### 🏠 Endereços de Entrega

- ✅ Selecionar endereço existente
- ✅ Cadastrar novo endereço
- ✅ Editar endereço existente
- ✅ Excluir endereço
- ✅ Buscar endereço por CEP
- ✅ Calcular frete baseado no endereço

### 📦 Criação de Pedidos

- ✅ Finalizar pedido com sucesso
- ✅ Gerar ID único para cada pedido
- ✅ Definir status como "EM ABERTO"
- ✅ Enviar email de confirmação
- ✅ Reduzir estoque dos produtos vendidos
- ✅ Impedir venda de produtos sem estoque
- ✅ Registrar histórico de movimentação de estoque

### 🔍 Consulta de Pedidos

- ✅ Buscar pedido por ID
- ✅ Exibir informações completas do pedido
- ✅ Listar pedidos do cliente
- ✅ Filtrar por status e período
- ✅ Ordenar por data e valor
- ✅ Cancelar pedidos em aberto
- ✅ Imprimir comprovante
- ✅ Reenviar email de confirmação

## 🚀 Como Executar os Testes

### Pré-requisitos

1. **Backend rodando**: Certifique-se de que o backend está executando na porta 3000
2. **Frontend rodando**: Certifique-se de que o frontend está executando na porta 5173
3. **Banco de dados**: SQLite deve estar configurado e acessível

### Comandos Disponíveis

```bash
# Abrir interface gráfica do Cypress
npm run cypress:open

# Executar todos os testes em modo headless
npm run cypress:run

# Executar testes específicos
npx cypress run --spec "cypress/e2e/cart-operations.cy.ts"
npx cypress run --spec "cypress/e2e/payment-methods.cy.ts"
npx cypress run --spec "cypress/e2e/address-selection.cy.ts"
npx cypress run --spec "cypress/e2e/order-creation.cy.ts"
npx cypress run --spec "cypress/e2e/order-consultation.cy.ts"

# Executar com navegador específico
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

## 📁 Estrutura dos Testes

```
cypress/
├── e2e/
│   ├── cart-operations.cy.ts      # Testes do carrinho
│   ├── payment-methods.cy.ts      # Testes de pagamento
│   ├── address-selection.cy.ts    # Testes de endereços
│   ├── order-creation.cy.ts       # Testes de criação de pedidos
│   └── order-consultation.cy.ts    # Testes de consulta de pedidos
├── support/
│   ├── commands.ts                # Comandos customizados
│   └── e2e.ts                     # Configurações globais
└── fixtures/                      # Dados de teste (se necessário)
```

## 🛠️ Comandos Customizados

O projeto inclui comandos customizados para facilitar os testes:

- `cy.createTestClient(clientData)` - Criar cliente de teste
- `cy.createTestProduct(productData)` - Criar produto de teste
- `cy.cleanupTestData()` - Limpar dados de teste
- `cy.addToCart(productId, quantity)` - Adicionar produto ao carrinho
- `cy.checkCartContains(productId, expectedQuantity)` - Verificar carrinho
- `cy.applyCoupon(couponCode)` - Aplicar cupom
- `cy.selectCreditCard(cardId)` - Selecionar cartão
- `cy.fillNewCreditCard(cardData)` - Preencher novo cartão
- `cy.selectDeliveryAddress(addressId)` - Selecionar endereço
- `cy.fillNewAddress(addressData)` - Preencher novo endereço
- `cy.completeOrder()` - Finalizar pedido
- `cy.searchOrder(orderId)` - Buscar pedido

## ⚙️ Configuração

### Arquivo `cypress.config.ts`

```typescript
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
```

### Variáveis de Ambiente

Os testes assumem as seguintes configurações:

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000/api`
- **Banco de dados**: SQLite local

## 📊 Relatórios

Os testes geram automaticamente:

- **Vídeos**: Gravados em `cypress/videos/`
- **Screenshots**: Salvos em `cypress/screenshots/` em caso de falha
- **Relatórios**: Console output detalhado

## 🔧 Manutenção dos Testes

### Adicionando Novos Testes

1. Crie um novo arquivo `.cy.ts` em `cypress/e2e/`
2. Use os comandos customizados disponíveis
3. Siga o padrão de nomenclatura com `data-testid`
4. Inclua validações de erro e casos extremos

### Atualizando Comandos Customizados

1. Edite `cypress/support/commands.ts`
2. Adicione novos comandos conforme necessário
3. Atualize as declarações de tipo em TypeScript

### Dados de Teste

- Os testes criam e limpam seus próprios dados
- Use `cy.cleanupTestData()` no `beforeEach()` para garantir isolamento
- Dados são criados via API para maior confiabilidade

## 🐛 Troubleshooting

### Problemas Comuns

1. **Backend não está rodando**

   ```bash
   cd backend && npm run dev
   ```

2. **Frontend não está rodando**

   ```bash
   npm run dev-frontend
   ```

3. **Porta já em uso**

   - Verifique se as portas 3000 e 5173 estão livres
   - Use `netstat -ano | findstr :3000` (Windows) para verificar

4. **Testes falhando por timeout**

   - Aumente os timeouts no `cypress.config.ts`
   - Verifique se a aplicação está respondendo corretamente

5. **Dados de teste não sendo limpos**
   - Verifique se `cy.cleanupTestData()` está sendo chamado
   - Confirme se os endpoints de limpeza existem no backend

## 📈 Próximos Passos

Para expandir a cobertura de testes, considere:

1. **Testes de Performance**: Medir tempo de resposta das operações
2. **Testes de Acessibilidade**: Validar WCAG compliance
3. **Testes de Responsividade**: Validar em diferentes tamanhos de tela
4. **Testes de Integração**: Validar com APIs externas (gateways de pagamento)
5. **Testes de Segurança**: Validar proteção contra vulnerabilidades

## 🤝 Contribuição

Para contribuir com os testes:

1. Siga os padrões estabelecidos
2. Adicione comentários explicativos
3. Inclua casos de teste para cenários de erro
4. Mantenha os testes independentes e isolados
5. Atualize este README quando necessário
