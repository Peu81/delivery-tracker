/**
 * @typedef {Object} Usuarios
 * @property {number} id
 * @property {string} nome
 * @property {string} email
 * @property {string} senha
 * @property {string} papel
 */

/**
 * @interface
 */

export class IMotoristasRepository {
    async listarTodos(filtros) { throw new Error("Método não implementado"); }
    async buscarPorId(id) { throw new Error("Método não implementado"); }
    async buscarPorEmail(email) { throw new Error("Método não implementado"); }
    async criar(dados) { throw new Error("Método não implementado"); }
    async atualizar(id, dados) { throw new Error("Método não implementado"); }

}