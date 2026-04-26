/**
@implements {IMotoristasRepository}
*/

export class motoristasRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async criar(dados) {
        try {
            return await this.prisma.motorista.create({
                data: {
                    nome: dados.nome,
                    cpf: dados.cpf,
                    placaVeiculo: dados.placaVeiculo,
                    status: dados.status
                }
            });

        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new AppError('CPF já cadastrado.', 409);
            }
            console.error("ERRO DO BANCO:", error); 
            throw error;             
        }
    }

    async buscarPorCpf(cpf) {
        return await this.prisma.motorista.findUnique({
            where: {cpf: cpf}
        })
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
        return await this.prisma.motorista.findUnique({
            where: {id: Number(id)}
        });
    }

    async atualizar(id, dados) {
        const {nome, placaVeiculo, status} = dados;
        await this.prisma.entrega.update({
            where: {id: Number(id)},
            data: {
                nome: dados.nome,
                placaVeiculo: dados.placaVeiculo,
                status: dados.status
            }
        });

        return await this.buscarPorId(id)
    }
}