/**
@implements {IMotoristasRepository}
*/

import { pool } from '../config/db.init.js';
import {AppError} from '../utils/AppError.js';

export class motoristasRepository {
    constructor(database) {
        this.database = database;
    }

    async criar(dados) {
        try {
            const {rows} = await pool.query(`INSERT INTO motoristas 
                (nome, cpf, placaVeiculo, status) VALUES ($1, $2, $3, $4)
                RETURNING *`, 
                [dados.nome, dados.cpf, dados.placaVeiculo, 'ATIVO']);
            
                return rows[0];   
        } catch (error) {
            if (error?.code === '23505') {
                throw new AppError('CPF já cadastrado.', 409);
            }
            console.error("ERRO DO BANCO:", error); 
            throw error;             
        }
    }

    async buscarPorCpf(cpf) {
        const {rows} = await pool.query(`SELECT id, 
                nome, 
                cpf, 
                placaVeiculo, 
                status 
                FROM motoristas WHERE cpf = $1`, [cpf]);
        
        return rows[0] ?? null;
            }
    
    async listarTodos(filtros = {}) {
        let query = `SELECT id, 
            nome, 
            cpf, 
            placaVeiculo, 
            status FROM motoristas`;
        const valores = [];
        const condicoes = [];
        let contador = 1;

        if (filtros.status) {
            condicoes.push(`status = $${contador}`);
            valores.push(filtros.status);
            contador++;
        }

        if (filtros.id) {
            condicoes.push(`id = $${contador}`);
            valores.push(filtros.id);
            contador++;
        }

        if (condicoes.length > 0) {
            query += `\nWHERE ` + condicoes.join(` AND `);
        }

        query += `\nORDER BY id`;

        const {rows} = await pool.query(query, valores)
        return rows;            
    }

    async buscarPorId(id) {
        const {rows} = await pool.query('SELECT * FROM motoristas WHERE id = $1', [id]);
        return rows[0] ?? null;
    }

    async atualizar(id, dados) {
        const {nome, placaVeiculo, status} = dados;
        const {rows} = await pool.query(
            `UPDATE motoristas SET nome = $1, placaVeiculo = $2, status = $3  
            WHERE id = $4
            RETURNING *` 
            [nome, placaVeiculo, status, id]);

        return rows ?? null;
    }
}