export class entregasRepository {
    constructor(database) {
        this.database = database;
    }

    async listarTodos() {
        return this.database.listarTodos();
    }

    async listarPorStatus(status) {
        return this.database.listarPorStatus(status);
    }

    async buscarPorId(id) {
        return this.database.buscarPorId(Number(id));
    }

    async historicoPorId(id) {
        return this.database.historicoPorId(Number(id));
    }

    async historicoPorId(id) {
        return this.database.historicoPorId(Number(id))
    }

    async criar(dados) {
        return this.database.criar(dados);
        };

    async atualizar(id, dados) {
        return this.database.atualizar(Number(id), dados);
    }
}
