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
                RETURNING id, nome, placaVeiculo, cpf, status`, 
                [dados.nome, dados.cpf, dados.placaVeiculo, 'ATIVO']);
            
                return rows[0];   
        } catch (error) {
            if (error?.code === '23505') {
                throw new AppError('CPF já cadastrado.', 409);
            }
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
    
    async listarTodos() {
        const {rows} = await pool.query(`SELECT id, 
                nome, 
                cpf, 
                placaVeiculo, 
                status FROM motoristas 
                ORDER BY id`);

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