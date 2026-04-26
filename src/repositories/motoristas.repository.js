/**
@implements {IMotoristasRepository}
*/

export class motoristasRepository {
    constructor(db) {
        this.db = db;
    }

    async criar(dados) {
        try {
            const result = await this.db.run(`INSERT INTO motoristas 
                (nome, cpf, placaVeiculo, status) VALUES (?, ?, ?, ?)`, 
                [dados.nome, dados.cpf, dados.placaVeiculo, 'ATIVO']);
            
            return {id: result.lastID, ...dados, status: 'ATIVO'};   
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new AppError('CPF já cadastrado.', 409);
            }
            console.error("ERRO DO BANCO:", error); 
            throw error;             
        }
    }

    async buscarPorCpf(cpf) {
        return await this.db.get(`SELECT id, 
            nome, 
            cpf, 
            placaVeiculo, 
            status 
            FROM motoristas WHERE cpf = ?`, [cpf]);
    }
    
    async listarTodos(filtros = {}) {
        let query = `SELECT id, 
            nome, 
            cpf, 
            placaVeiculo, 
            status FROM motoristas`;
        
        const valores = [];
        const condicoes = [];

        if (filtros.status) {
            condicoes.push(`status = ?`);
            valores.push(filtros.status);
        }

        if (filtros.id) {
            condicoes.push(`id = ?`);
            valores.push(filtros.id);
        }

        if (condicoes.length > 0) {
            query += `\nWHERE ` + condicoes.join(` AND `);
        }

        query += `\nORDER BY id`;

        return await this.db.all(query, valores)
    }

    async buscarPorId(id) {
        return await this.db.get('SELECT * FROM motoristas WHERE id = ?', [id]);
    }

    async atualizar(id, dados) {
        const {nome, placaVeiculo, status} = dados;
        await this.db.run(
            `UPDATE motoristas SET nome = ?, placaVeiculo = ?, status = ?  
            WHERE id = ?`, 
            [nome, placaVeiculo, status, id]);

        return await this.buscarPorId(id)
    }
}