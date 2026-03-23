export class entregasDatabase {
  constructor() {
    this.entregas = [];
    this.nextId = 1;

  }

    getEntregas() {
    return this.entregas;
    }

    generateId() {
        return this.nextId++;
    }

    listarTodos() {
        return this.entregas;
        }

    listarPorStatus(status) {
        return this.entregas.filter((e) => e.status === status);
    }

    buscarPorId(id) {
        return this.entregas.find((e) => e.id === Number(id));
        }

    historicoPorId(id) {
        const entrega = this.entregas.find((e) => e.id === Number(id));

        return entrega ? entrega.historico : null;
    }

    criar(dados) {
        const novaEntrega = {id: this.generateId(), ...dados};
        this.entregas.push(novaEntrega);
        return novaEntrega;
        }

    atualizar(id, dados) {
        const indice = this.entregas.findIndex((e) => e.id === Number(id));
        if (indice === -1) return false;
        this.entregas[indice] = {...this.entregas[indice], ...dados};
        return this.entregas[indice];
        }
}
