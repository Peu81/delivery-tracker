## 1. Visão Geral do Sistema:

Esta API foi desenvolvida para gerenciar o fluxo de entregas e o cadastro de motoristas, garantindo integridade de dados através de validações de CPF e regras de status de entrega.


## 2. Guia de Referência de Endpoints:

Código,Status,Motivo
201,Created,Recurso criado com sucesso.
409,Conflict,CPF já cadastrado no sistema.
422,Unprocessable Entity,Erro de regra: Entrega não 'CRIADA' ou motorista inativo.
200,OK,Consulta ou atualização realizada.

## 3. Exemplos de Requisição (cURL):

Cadastrar motorista:

curl -X POST http://localhost:3000/api/motoristas/ \
-H "Content-Type: application/json" \
-d '{"nome": "Joana Prado", "cpf": "111.111.111-11", "placaVeiculo": "1234-ABC"}'

Atribuir Entrega:

curl -X PATCH http://localhost:3000/api/entregas/1/atribuir \
-H "Content-Type: application/json" \
-d '{"motoristaId": 1}'


## 4. Regras de Negócio e Códigos de Resposta:

Código,Status,Motivo
201,Created,Recurso criado com sucesso.
409,Conflict,CPF já cadastrado no sistema.
422,Unprocessable Entity,Erro de regra: Entrega em outro status ou motorista inativo.
200,OK,Consulta ou atualização realizada.


## 5. Diagrama de Dependências e Fluxo:

A estrutura abaixo representa a composição lógica do sistema:

       [ CLIENTE / POSTMAN ]
                |
                v
       [ API DE LOGÍSTICA ]
       (Express.js / Node.js)
                |
      --------------------------
      |                        |
[ ENTIDADES ]            [ REGRAS DE NEGÓCIO ]
  |-- Motoristas <-------|-- Unicidade de CPF (409 Conflict)
  |-- Entregas   <-------|-- Fluxo de Status (CRIADA -> ATRIBUÍDA)
                         |-- Validação de Atribuição:
                               |-- Entrega deve ser 'CRIADA'
                               |-- Motorista deve estar 'ATIVO'