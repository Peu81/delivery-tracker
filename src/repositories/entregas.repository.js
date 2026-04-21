/**
@implements {IEntregasRepository}
*/

import { pool } from "../config/db.init.js";

export class entregasRepository {
    constructor(database) {
        this.database = database;
    }

    async listarTodos(filtros = {}) {
        let query = `SELECT id,
            descricao,
            origem,
            destino,
            status,
            fk_id_motorista FROM entregas`;
        
        const valores = [];
        const condicoes = [];
        let contador = 1;

        if (filtros.status) {
            condicoes.push(`status = $${contador}`);
            valores.push(filtros.status);
            contador++;
        }

        if (filtros.motoristaId) {
            condicoes.push(`fk_id_motorista = $${contador}`);
            valores.push(filtros.motoristaId);
            contador++;
        }

        if (condicoes.length > 0) {
            query += `\nWHERE ` + condicoes.join(` AND `);
        }

        query += `\nORDER BY id`;

        const {rows} = await pool.query(query, valores);

        return rows;
    }

    async listarPorStatus(status) {
        const {rows} = await pool.query(`SELECT * FROM entregas WHERE status = $1`, [status])
        return rows ?? null;
    }

    async buscarPorId(id) {
        const {rows} = await pool.query(`SELECT * FROM entregas WHERE id = $1`, [id]);
        return rows ?? null;
    }

    async historicoPorId(idEntrega) {
        const {rows} = await pool.query(
            `SELECT id, informacoes, data, fk_id_entrega
            FROM eventos_entrega
            WHERE fk_id_entrega = $1
            ORDER BY data DESC`, [idEntrega]);
        
        return rows ?? null;
    }

    async criar(dados) {
        const {rows: entregasCriadas} = await pool.query(`INSERT INTO entregas
            (descricao, origem, destino, status) VALUES ($1, $2, $3, $4)
            RETURNING id, descricao, origem, destino, status`,
            [dados.descricao, dados.origem, dados.destino, 'CRIADA']);

        const entrega = entregasCriadas;

        await pool.query(
            `INSERT INTO eventos_entrega (informacoes, fk_id_entrega)
            VALUES ($1, $2)`, 
            [`Entrega 'CRIADA'`, entrega.id]);
        
        return entrega ?? null;
    }

    async entregasDuplicadas(descricao, origem, destino) {
        const {rows} = await pool.query(`
            SELECT * FROM entregas
            WHERE descricao = $1 AND origem = $2 AND destino = $3`,
            [descricao, origem, destino]);
        
        return rows ?? null;
    }

    async atualizar(id, dados) {
        const {descricao, origem, destino, status, fk_id_motorista} = dados;
        
        const {rows: atualizaEntrega} = await pool.query(
            `UPDATE entregas
            SET descricao = $1, origem = $2, destino = $3, status = $4, fk_id_motorista = $5
            WHERE id = $6
            RETURNING *`,
            [dados.descricao, dados.origem, dados.destino, dados.status, fk_id_motorista, id]);
        
        const entregaAtualizada = atualizaEntrega;

        if (entregaAtualizada) {
            await pool.query(
                `INSERT INTO eventos_entrega (informacoes, fk_id_entrega)
                VALUES ($1, $2)`,
                [`Status atualizado para: ${dados.status}`, id]
            );
        
        return entregaAtualizada ?? null;
        }
    }

    async listaPorMotorista(motoristaId, status) {
        let query = `SELECT * FROM entregas WHERE fk_id_motorista = $1`;
        const valores = [motoristaId];
        
        if (status) {
            query += `AND status = $2`;
            valores.push(status);
        }

        const {rows} = await pool.query(query, valores);
        return rows;
    }
}
