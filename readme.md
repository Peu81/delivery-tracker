### ALUNO: José Pedro Costa Duda
### 5° período

### ATIVIDADE 06 - API PARA ENTREGAS

A API desenvolvida tem como proposito gerir processos de logistica entre entregas e motoristas, construida a partir de arquiteturas como Repository Pattern e Inversão de Dependências.

--- 

### Documentação da API:

### Motoristas:

#### Criar motorista

    URL: /motoristas | método: POST

    Corpo: {"nome": "Joana Prado", "cpf": "111.111.111-11", "placaVeiculo": "1234-ABC"}

    RETORNO ESPERADO (201):

    {
        "id": 1, "nome": "Joana Prado", 
        "cpf": "111.111.111-11", 
        "placaVeiculo": "1234-ABC", 
        "status": "ATIVO"
    }

    ERRO (409 Conflict): {"erro": "Já existe um motorista com este CPF."}



### Listar entregas do motorista

    URL: /api/motoristas/:id/entregas | Método: GET

    Query Params: status= (opcional para identificar as diversas entregas em um único status).

    RETORNO ESPERADO (200): Lista de objetos de entrega vinculados ao ID do motorista.

    [
    {
        "id": 2,
        "status": "CRIADA",
        "descricao": "Kit Capinha + Celular",
        "origem": "Maceio",
        "destino": "Recife",
        "historico": [
            {
                "data": "2026-03-30",
                "descricao": "Entrega 'CRIADA'."
            },
            {
                "data": "2026-03-30",
                "descricao": "Motorista Luan Pablo atribuído."
            }
        ],
        "motoristaId": 2
    }
    ]


### Entregas:

#### Criar entrega
    
    URL: /api/entregas/ | Método: POST

    Corpo: {"descricao": "Notebook Dell", "origem": "Fortaleza", "destino": "Maceio"}

    RETORNO ESPERADO (201):

        {
            "id": 1,
            "status": "CRIADA",
            "descricao": "Notebook Dell",
            "origem": "Fortaleza",
            "destino": "Maceio",
            "historico": [
                { "data": "2026-03-30", "descricao": "Entrega 'CRIADA'." }
            ]
        }


#### Atribuir motorista à entrega:

    URL: /api/entregas/:id/atribuir | Método: PATCH

    Corpo: {"motoristaId": 1}

    RETORNO ESPERADO (200): Objeto da entrega atualizado com o motoristaId e novo evento no histórico.

    {
        "id": 2,
        "status": "CRIADA",
        "descricao": "Notebook Dell",
        "origem": "Fortaleza",
        "destino": "Recife",
        "historico": [
            {
                "data": "2026-03-30",
                "descricao": "Entrega 'CRIADA'."
            },
            {
                "data": "2026-03-30",
                "descricao": "Motorista Joana Prado atribuído."
            }
        ],
        "motoristaId": 1
    }

    ERROS DE VALIDAÇÃO (422 Unprocessable Entity):

        Status inválido: {"erro": "Só é possível atribuir entregas com status 'CRIADA'."}
        Motorista inativo: {"erro": "Não é possível atribuir entregas para motoristas inativos."}



## Estrutura de dependência da API: 

    Como dito anteriormente, o uso da *Inversão de Dependencia* força ainda mais a divisão das tarefas. Aqui os services não dependem de classes concretas, mas sim de abstrações (implementadas por meio de interfaces).

    [ Database ]
        ▼
    [ EntregasRepository ] <----- Contrato: IEntregasRepository
    [ MotoristasRepository ] <--- Contrato: IMotoristasRepository
        ▼
    [ EntregasService ] <------- Recebe Repositories via Constructor
    [ MotoristasService ] <----- Recebe Repository via Constructor
        ▼
    [ Controllers ] <----------- Orquestram os inputs/outputs
