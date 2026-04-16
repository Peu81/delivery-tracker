/**
@implements {IEntregasRepository}
*/

export class entregasRepository {
    constructor(database) {
        this.database = database;
    }

    async listarTodos(filtros) {
        return this.database.listarTodos(filtros);
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

    async criar(dados) {
        return this.database.criar(dados);
        }

    async entregasDuplicadas(descricao, origem, destino) {
        const novaEntrega = await this.database.listarTodos();

        const duplicata = novaEntrega.find((e) => 
        e.descricao === descricao &&
        e.origem === origem &&
        e.destino === destino);

        return duplicata;
    }

    async atualizar(id, dados) {
        return this.database.atualizar(Number(id), dados);
    }

    async listaPorMotorista(motoristaId, status) {
        let entregas = await this.database.listarTodos();

        entregas = entregas.filter((e) => Number(e.motoristaId) === Number(motoristaId));

        if (status) {
            entregas = entregas.filter((e) => e.status === status);
        }

        console.log(entregas); 

        return entregas;

        
    }
}
