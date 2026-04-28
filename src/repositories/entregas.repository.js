/**
@implements {IEntregasRepository}
*/

import { info } from "node:console";
import { describe } from "node:test";

export class entregasRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async listarTodos(filtros = {}) {
        return await this.prisma.entrega.findMany();           
    }

    async listarPorStatus(status) {
        return await this.prisma.entrega.findMany({
            where: {status}
        });
    }

    async buscarPorId(id) {
        return await this.prisma.entrega.findUnique({
            where: {id: Number(id)},
            include: {eventos: true}
        });
    }

    async historicoPorId(idEntrega) {
        return await this.prisma.entrega.findUnique({
            where: {fk_id_entrega: Number(idEntrega)},
            orderBy: {createdAt: 'desc'}
        });
    }

    async criar(dados) {
        let infoEvento = "Entrega 'CRIADA'.";

        if (dados.historico && dados.historico.length > 0) {
            infoEvento = dados.historico[0].descricao;
        }

        const result = await this.prisma.entrega.create({
            data: {
                descricao: dados.descricao,
                origem: dados.origem,
                destino: dados.destino,
                status: dados.status || 'CRIADA',
                fk_id_motorista: Number(dados.fk_id_motorista),
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

        await this.prisma.entrega.update( 
                {where: {id: Number(id)},
                data: {
                    descricao: dados.descricao,
                    origem: dados.origem,
                    destino: dados.destino,
                    status: dados.status,
                    fk_id_motorista: Number(dados.fk_id_motorista),
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
