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
        const where = {};
        if (filtros.status) where.status = filtros.status;
        if (filtros.id) where.id = filtros.id;

        return await this.prisma.motorista.findMany({
            where,
            orderBy: {id: 'asc'}
        });
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
    }
}