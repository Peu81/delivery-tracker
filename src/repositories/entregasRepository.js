/**
@implements {IEntregasRepository}
*/

export class entregasRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async listarTodos(filtros = {}) {
        const page = parseInt(filtros.page) || 1;
        const limit = Math.min(parseInt(filtros.limit) || 10, 50);
        const skip = (page - 1) * limit;
        
        const where = {};

        if (filtros.status) {
            where.status = filtros.status;
        }

        if (filtros.motoristaId) {
            where.fk_id_motorista = parseInt(filtros.motoristaId);
        }
        
        if (filtros.createdDe || filtros.createdAte) {
            where.createdAt = {};
            if (filtros.createdDe) {
                where.createdAt.gte = new Date(filtros.createdDe)
            }
            if (filtros.createdAte) {
                where.createdAt.lte = new Date(filtros.createdAte)
            }
        }

        const [data, total] = await Promise.all([
            this.prisma.entrega.findMany({
                where: where, 
                skip: skip, 
                take: limit, 
                orderBy: {id: 'asc'}
            }),
            this.prisma.entrega.count({where})]
        );
        
        const totalPaginas = Math.ceil(total/limit);

        return {data, total, page, limit, totalPaginas}
    }
    async listarPorStatus(status) {
        return await this.prisma.entrega.findMany({
            where: {status: status}
        });
    }

    async buscarPorId(id) {
        return await this.prisma.entrega.findUnique({
            where: {id: Number(id)},
            include: {eventos: true}
        });
    }

    async historicoPorId(idEntrega) {
        return await this.prisma.eventoEntrega.findMany({
            where: {fk_id_entrega: Number(idEntrega)},
            orderBy: {createdAt: 'desc'}
        });
    }

    async criar(dados) {
        let infoEvento = "Entrega 'CRIADA'.";

        if (dados.historico && dados.historico.length > 0) {
            infoEvento = dados.historico[0].descricao;
        }

        return await this.prisma.entrega.create({
            data: {
                descricao: dados.descricao,
                origem: dados.origem,
                destino: dados.destino,
                status: dados.status || 'CRIADA',
                ...(dados.fk_id_motorista !== undefined && {
                    fk_id_motorista: Number(dados.fk_id_motorista)}),
                eventos: {create: [{informacoes: infoEvento}]}
            }});

    }

    async entregasDuplicadas(descricao, origem, destino) {
        return await this.prisma.entrega.findFirst(
            {where: {descricao, origem, destino}}
        );
    }

    async atualizar(id, dados) {
        let infoEvento = `Status atualizado para: ${dados.status}`;

        if (dados.historico && dados.historico.length > 0) {
            const ultimoEvento = dados.historico[dados.historico.length - 1];
            infoEvento = ultimoEvento.descricao;
        }

        const idMotorista = dados.motoristaId || dados.fk_id_motorista;
        
        await this.prisma.entrega.update( 
                {where: {id: Number(id)},
                data: {
                    descricao: dados.descricao,
                    origem: dados.origem,
                    destino: dados.destino,
                    status: dados.status,
                    ...(dados.fk_id_motorista !== undefined && {
                    fk_id_motorista: Number(dados.fk_id_motorista)}),
                    eventos: {create: [{informacoes: infoEvento}]}
                },
                include: {eventos: true}
            }
        );
        
        return await this.buscarPorId(id);
    }
    
    async listaPorMotorista(motoristaId, status) {
        const where = {fk_id_motorista: Number(motoristaId)};

        if (status) {
            where.status = status;
        }

        return await this.prisma.entrega.findMany({where});
    }
}
