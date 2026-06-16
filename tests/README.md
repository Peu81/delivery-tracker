# Estratégia de Testes - Delivery Tracker

## 1. Estratégia de Testes

A suíte de testes deste projeto foi estruturada baseada no modelo conceitual da **Pirâmide de Testes**. A abordagem foi dividida nas três camadas principais:

*   **Testes Unitários (Base):** Focados nos `Services` (de entregas e usuários), isolando as dependências externas. O padrão escolhido foi o Triple A (*Arrange-Act-Assert*) e a utilização de *mocks* do Jest para simular o banco de dados e o uso de bibliotecas externas (como o ‘bycript’), garantindo testes rápidos, sem invocar o banco de dados real da API.

*   **Testes de Integração (Meio):** Focados nas rotas HTTP, foi utilizada a biblioteca `Supertest` para levantar a aplicação e fazer requisições reais aos endpoints, validando integração entre rotas, middlewares de segurança (autenticação JWT e autorização RBAC) e o banco de dados SQLite.

*   **Testes End-to-End (Topo):** Aqui foi feito o uso do `Playwright` e a arquitetura *Page Object Model* (POM), que permitiu testes dos fluxos críticos de negócio no navegador, simulando o comportamento de um usuário real e utilizando atributos `data-testid` nas views do EJS para localizar os elementos de forma robusta e imune a mudanças de estilo.

## 2. Como Executar
O projeto possui comandos configurados no `package.json` para executar cada camada de forma isolada:

*   **Para rodar Testes Unitários e de Integração:**
    ```bash
    npm test + caminho do arquivo a ser executado.
    ```
*   **Para rodar os Testes Funcionais (E2E no navegador):**
    ```bash
    npx playwright run test:e2e
    ```
*   **Para gerar o Relatório de Cobertura de Código:**
    ```bash
    npm run test:coverage
    ```

## 3. Análise de Cobertura de Código (RF-07)

Após a análise do relatório gerado, o arquivo `src/services/motoristasService.js` apresentou uma cobertura quase nula (5.88% de Statements). Abaixo seguem os dois trechos críticos (solicitados pela atividade), deste arquivo que não foram exercitados pelos testes:

### Trecho 1: Validação de duplicidade na criação de motorista
```javascript
// Localizado em motoristasService.js (método criar)
const motorista = await this.repository.buscarPorCpf(cpf);

if (motorista) {
    throw new AppError("CPF já cadastrado no sistema.", 409);
}

Por que não está sendo testado? A suíte de testes unitários solicitada nesta etapa do projeto focou exclusivamente nas regras de negócio do EntregasService (RF-02) e AuthService (RF-03). Por conta disso, a classe de serviço dos motoristas não recebeu um arquivo .test.js dedicado com mocks simulando o seu repositório.
Qual o impacto de um bug nele? Se essa validação for acidentalmente removida ou se a lógica do if falhar, a aplicação tentará inserir um motorista com um CPF que já existe. Isso fará com que o banco de dados rejeite a inserção (Unique Constraint Violation) e dispare um erro 500 genérico no servidor, em vez de retornar o amigável erro 409 de conflito para o usuário.
Vale a pena testar? Sim, sem dúvida. Como se trata de uma regra de negócio central para a integridade dos dados (evitar cadastros duplicados), vale a pena criar um teste unitário mockando buscarPorCpf para retornar um motorista fictício e garantindo que o AppError seja disparado.

Trecho 2: Tratamento de "Não Encontrado" na busca
// Localizado em motoristasService.js (método buscarPorId)
const motorista = await this.repository.buscarPorId(Number(id));

if (!motorista) {
    throw new AppError("Motorista não encontrado.", 404);
}

Por que não está sendo testado? Pelo mesmo motivo anterior: os testes focaram nas entidades de Entrega e Usuário/Auth. Não houve simulação de busca de motoristas inexistentes durante a execução da suíte.
Qual o impacto de um bug nele? Se um ID inválido for buscado e o sistema não barrar a execução neste if, a variável motorista será nula. Qualquer manipulação subsequente desse objeto nulo na aplicação resultaria em um "TypeError: Cannot read properties of null", ocasionando o travamento ("crash") da requisição.

Vale a pena testar? Sim. É um fluxo de exceção (Sad Path) simples e crucial. Um teste unitário rápido usando jest.fn().mockResolvedValue(null) no repositório garantiria que a falha aconteça de forma elegante e controlada, retornando um status 404.

***