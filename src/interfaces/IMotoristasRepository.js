/**
 * @typedef {Object} Motorista
 * @property {number} id
 * @property {string} nome
 * @property {string} cpf
 * @property {string} placaVeiculo
 * @property {string} status
 */

/**
 * @interface
 */

export class IMotoristasRepository {
    async listarTodos(filtros) { throw new Error("Método não implementado"); }
    async buscarPorId(id) { throw new Error("Método não implementado"); }
    async buscarPorCpf(cpf) { throw new Error("Método não implementado"); }
    async criar(dados) { throw new Error("Método não implementado"); }
    async atualizar(id, dados) { throw new Error("Método não implementado"); }

}