export class EntregasRepository {
    constructor(database) {
        this.database = database;
    }

    async listarTodos() {
        return this.database.listarTodos();
    }

    async buscarPorId(id) {
        return this.database.buscarPorId(id);
    }

    async criar(dados) {
        return this.database.criar(dados);
        };

    async atualizar(id, dados) {
        return this.database.atualizar(id, dados);
    }

}
