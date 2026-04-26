/**
@implements {IEntregasRepository}
*/

export class entregasRepository {
    constructor(db) {
        this.db = db;
    }

    async listarTodos(filtros = {}) {
        return await this.db.all(`SELECT * FROM entregas`);           
    }

    async listarPorStatus(status) {
        return await this.db.all(`SELECT * FROM entregas WHERE status = ?`, [status])
    }

    async buscarPorId(id) {
        return await this.db.get(`SELECT * FROM entregas WHERE id = ?`, [id]);
    }

    async historicoPorId(idEntrega) {
        return await this.db.all(
            `SELECT id, informacoes, data, fk_id_entrega
            FROM eventos_entrega
            WHERE fk_id_entrega = ?
            ORDER BY data DESC`, [idEntrega]);
    }

    async criar(dados) {
        const result = await this.db.run(`INSERT INTO entregas
            (descricao, origem, destino, status, fk_id_motorista) VALUES (?, ?, ?, ?, ?)
            RETURNING id, descricao, origem, destino, status`,
            [dados.descricao, dados.origem, dados.destino, 'CRIADA', dados.fk_id_motorista]);

        const idNovaEntrega = result.lastID;

        let infoEvento = "Entrega 'CRIADA'.";

        if (dados.historico && dados.historico.length > 0) {
            infoEvento = dados.historico[0].descricao;
        }

        await this.db.run(`INSERT INTO eventos_entrega (informacoes, fk_id_entrega) VALUES (?, ?)
            `, [infoEvento, idNovaEntrega]);

        return {id: idNovaEntrega, ...dados, status: 'CRIADA'};
    }

    async entregasDuplicadas(descricao, origem, destino) {
        return await this.db.get(`
            SELECT * FROM entregas
            WHERE descricao = ? AND origem = ? AND destino = ?`,
            [descricao, origem, destino]);
    }

async atualizar(id, dados) {
        await this.db.run(
            `UPDATE entregas
            SET descricao = ?, origem = ?, destino = ?, status = ?, fk_id_motorista = ?
            WHERE id = ?`,
            [dados.descricao, dados.origem, dados.destino, dados.status, dados.fk_id_motorista, id]
        );

        let infoEvento = `Status atualizado para: ${dados.status}`;

        if (dados.historico && dados.historico.length > 0) {
            const ultimoEvento = dados.historico[dados.historico.length - 1];
            infoEvento = ultimoEvento.descricao;
        }
        
        await this.db.run(
            `INSERT INTO eventos_entrega (informacoes, fk_id_entrega) VALUES (?, ?)`,
            [infoEvento, id]
        );
        
        return await this.buscarPorId(id);
    }
    
    async listaPorMotorista(motoristaId, status) {
        let query = `SELECT * FROM entregas WHERE fk_id_motorista = ?`;
        const valores = [motoristaId];
        
        if (status) {
            query += `AND status = ?`;
            valores.push(status);
        }

        return await this.db.all(query, valores);
    }
}
