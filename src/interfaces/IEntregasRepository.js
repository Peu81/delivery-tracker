/**
 * @typedef {Object} Entrega
 * @property {number} id
 * @property {string} descricao
 * @property {string} status
 * @property {number} [motoristaId]
 */

/**
 * @interface
 */

export class IEntregasRepository {
    async listarTodos(filtros) { throw new Error("Método não implementado"); }
    async buscarPorId(id) { throw new Error("Método não implementado"); }
    async criar(dados) { throw new Error("Método não implementado"); }
    async atualizar(id, dados) { throw new Error("Método não implementado"); }

}