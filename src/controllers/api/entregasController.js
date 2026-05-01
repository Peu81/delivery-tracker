import { json } from "express";

export class entregasController {
    constructor(service) {
        this.service = service;

        this.listarTodos = this.listarTodos.bind(this);
        this.buscarPorId = this.buscarPorId.bind(this);
        this.criar = this.criar.bind(this);
        this.atualizar = this.atualizar.bind(this);
        this.atribuiMotorista = this.atribuiMotorista.bind(this);
    }


    
    async listarTodos(req, res, next) {
        try {
            const { status } = req.query;
            const entregas = await this.service.listarTodos(status); 
            res.status(200).json(entregas);

        } catch (error) {
            next(error);
        }
    }

    async listarPorStatus(req, res, next) {
        try {
            
            const statusEntrega = await this.service.listarTodos(req.query);

            res.status(200).json(statusEntrega);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const entrega = await this.service.buscarPorId(Number(req.params.id));
            res.status(200).json(entrega);

        } catch (error) {
            next(error);
        }
    }

    async historicoPorId(req, res) {
        const historico = await this.service.historicoPorId(Number(req.params.id));
        res.status(200).json(historico);
    }

    async criar(req, res, next) {
        try {
            const novaEntrega = await this.service.criar(req.body);
            res.status(201).json(novaEntrega);
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const entregaAtualizada = await this.service.atualizar(Number(req.params.id),
            req.body)
           
            res.status(200).json(entregaAtualizada);
        } catch (error) {
            next(error);
        }
    }

    async cancelar(req, res, next) {
        try {
            const entrega = await this.service.cancelar(req.params.id);
            res.status(204).json({
                mensagem: "Entrega cancelada"
            });

        } catch (error) {
            next(error);
        }

    }

    async avancaStatus(req, res, next) {
        try {
            const entrega = await this.service.avancaStatus(req.params.id);
            res.status(200).json({
                mensagem: "Status da entrega atualizado!"
            });
            
        } catch (error) {
            next(error)
        }
    }

    async atribuiMotorista(req, res, next)  {
        try {
            const entrega = await this.service.atribuiMotorista(req.params.id, req.body.motoristaId);
            res.status(200).json(entrega);
        } catch (error) {
            next(error);
        }
    }

    async listaEntregaPorMotorista(req, res, next) {
        try {
            const {id} = req.params;
            const {status} = req.query;
            const entregas = await this.service.listaPorMotorista(id, status);

            res.status(200).json(entregas);

        } catch (error) {
            next(error);
        }
    }
}