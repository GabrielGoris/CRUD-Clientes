# Testes E2E com Cypress - Sistema E-commerce Completo

Este projeto inclui uma suíte completa de testes end-to-end (E2E) usando Cypress para validar todas as funcionalidades do sistema de e-commerce, incluindo carrinho de compras, pagamento, endereços e gestão de pedidos.

## 📋 Escopo dos Testes Implementados

Os testes cobrem todos os cenários solicitados:

### 🛒 Operações do Carrinho

**Arquivo: `cart-operations.cy.ts`**

- ✅ Adicionar produtos ao carrinho (individual e múltiplos)
- ✅ Remover produtos do carrinho (individual e todos)
- ✅ Alterar quantidade de itens (aumentar, diminuir, editar manualmente)
- ✅ Calcular total corretamente com múltiplos itens
- ✅ Persistir carrinho entre sessões
- ✅ Validações de carrinho vazio
- ✅ Validação de quantidade mínima (remove item quando chega a zero)
- ✅ Confirmação de ações (remoção, limpeza)

### 💳 Formas de Pagamento

**Arquivo: `payment-methods.cy.ts`**

- ✅ Aplicar cupons de troca (múltiplos permitidos)
- ✅ Aplicar cupons promocionais (apenas um permitido)
- ✅ Combinar cupons de troca e promocionais
- ✅ Usar cartões de crédito já cadastrados
- ✅ Cadastrar novos cartões durante o pagamento
- ✅ Usar múltiplos cartões para pagamento
- ✅ Validações de cartão (expirado, limite, dados inválidos)
- ✅ Validação de valores (soma dos cartões = total)
- ✅ Rejeição de cupons inválidos ou já utilizados

### 🏠 Endereços de Entrega

**Arquivo: `address-selection.cy.ts`**

- ✅ Selecionar endereço existente
- ✅ Cadastrar novo endereço
- ✅ Editar endereço existente
- ✅ Excluir endereço
- ✅ Buscar endereço por CEP (preenchimento automático)
- ✅ Calcular frete baseado no endereço
- ✅ Validação de campos obrigatórios
- ✅ Validação de formato do CEP
- ✅ Limite de endereços por cliente
- ✅ Confirmação de ações (exclusão, cancelamento)

### 📦 Criação de Pedidos

**Arquivo: `order-creation.cy.ts`**

- ✅ Finalizar pedido com sucesso
- ✅ Gerar ID único para cada pedido
- ✅ Definir status como "EM ABERTO"
- ✅ Enviar email de confirmação
- ✅ Reduzir estoque dos produtos vendidos
- ✅ Impedir venda de produtos sem estoque
- ✅ Registrar histórico de movimentação de estoque
- ✅ Validação de dados obrigatórios
- ✅ Validação de carrinho não vazio
- ✅ Cálculo correto com descontos
- ✅ Integração com sistema de pagamento
- ✅ Tratamento de erros de pagamento
- ✅ Notificações para administrador
- ✅ Atualização de status em tempo real

### 🔍 Consulta de Pedidos

**Arquivo: `order-consultation.cy.ts`**

- ✅ Buscar pedido por ID
- ✅ Exibir informações completas do pedido
- ✅ Listar pedidos do cliente
- ✅ Filtrar por status e período
- ✅ Ordenar por data e valor
- ✅ Cancelar pedidos em aberto
- ✅ Impedir cancelamento de pedidos processados
- ✅ Imprimir comprovante
- ✅ Reenviar email de confirmação
- ✅ Exibir rastreamento do pedido
- ✅ Estatísticas do cliente
- ✅ Relatórios e gráficos

## 📝 Cenários de Teste Específicos Implementados

### Cenários do Carrinho

1. **Adicionar produtos**: Testa adição individual e múltipla de produtos
2. **Alterar quantidades**: Testa botões +/- e edição manual
3. **Remover itens**: Testa remoção individual e limpeza completa
4. **Persistência**: Verifica se carrinho mantém dados entre sessões
5. **Validações**: Testa carrinho vazio e quantidades mínimas

### Cenários de Pagamento

1. **Cupons de troca**: Múltiplos cupons podem ser aplicados
2. **Cupons promocionais**: Apenas um cupom promocional por vez
3. **Combinação**: Cupons de troca + promocional simultaneamente
4. **Cartões existentes**: Seleção de cartões já cadastrados
5. **Novos cartões**: Cadastro durante o checkout
6. **Múltiplos cartões**: Pagamento dividido entre cartões
7. **Validações**: Cartões expirados, limite insuficiente, dados inválidos

### Cenários de Endereço

1. **Seleção**: Escolha entre endereços cadastrados
2. **Cadastro**: Novo endereço durante checkout
3. **Edição**: Modificação de endereços existentes
4. **Exclusão**: Remoção de endereços
5. **CEP**: Busca automática por CEP
6. **Frete**: Cálculo baseado no endereço selecionado
7. **Limites**: Máximo de endereços por cliente

### Cenários de Pedido

1. **Criação**: Finalização completa do pedido
2. **ID único**: Geração de identificador único
3. **Status**: Definição como "EM ABERTO"
4. **Email**: Envio de confirmação
5. **Estoque**: Redução automática do estoque
6. **Validações**: Produtos sem estoque, dados obrigatórios
7. **Integração**: Processamento de pagamento
8. **Notificações**: Alertas para administradores

### Cenários de Consulta

1. **Busca por ID**: Localização de pedidos específicos
2. **Listagem**: Todos os pedidos do cliente
3. **Filtros**: Por status e período
4. **Ordenação**: Por data e valor
5. **Cancelamento**: Pedidos em aberto
6. **Comprovantes**: Impressão de recibos
7. **Rastreamento**: Acompanhamento de entrega
8. **Estatísticas**: Relatórios do cliente

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

### Comandos de Dados de Teste

- `cy.createTestClient(clientData)` - Criar cliente de teste
- `cy.createTestProduct(productData)` - Criar produto de teste
- `cy.cleanupTestData()` - Limpar dados de teste

### Comandos do Carrinho

- `cy.addToCart(productId, quantity)` - Adicionar produto ao carrinho
- `cy.checkCartContains(productId, expectedQuantity)` - Verificar se produto está no carrinho

### Comandos de Pagamento

- `cy.applyCoupon(couponCode)` - Aplicar cupom de desconto
- `cy.selectCreditCard(cardId)` - Selecionar cartão cadastrado
- `cy.fillNewCreditCard(cardData)` - Preencher dados de novo cartão

### Comandos de Endereço

- `cy.selectDeliveryAddress(addressId)` - Selecionar endereço existente
- `cy.fillNewAddress(addressData)` - Preencher dados de novo endereço

### Comandos de Pedido

- `cy.completeOrder()` - Finalizar pedido
- `cy.searchOrder(orderId)` - Buscar pedido por ID

### Estrutura dos Dados

**Dados do Cliente:**

```typescript
{
  nome: string,
  email: string,
  cpf: string,
  dataNascimento: string,
  telefone: string
}
```

**Dados do Produto:**

```typescript
{
  nome: string,
  preco: number,
  estoque: number,
  categoria: string,
  descricao: string
}
```

**Dados do Cartão:**

```typescript
{
  number: string,
  name: string,
  expiry: string,
  cvv: string,
  brand: string
}
```

**Dados do Endereço:**

```typescript
{
  cep: string,
  street: string,
  number: string,
  neighborhood: string,
  city: string,
  state: string
}
```

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
