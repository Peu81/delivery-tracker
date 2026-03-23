export class entregasController {
    constructor(service) {
        this.service = service;

        this.listarTodos = this.listarTodos.bind(this);
        this.buscarPorId = this.buscarPorId.bind(this);
        this.criar = this.criar.bind(this);
        this.atualizar = this.atualizar.bind(this);
    }


    
    async listarTodos(req, res, next) {
        try {
            const { status } = req.query;
            const entregas = await this.service.listarTodos(status); 
            res.json(entregas);

        } catch (error) {
            next(error);
        }
    }

    async listarPorStatus(req, res, next) {
        try {
            
            const statusEntrega = await this.service.listarTodos(req.query);

            res.json(statusEntrega);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const entrega = await this.service.buscarPorId(Number(req.params.id));
            res.json(entrega);
        } catch (error) {
            next(error);
        }
    }

    async historicoPorId(req, res) {
        const historico = await this.service.historicoPorId(Number(req.params.id));
        res.json(historico);
    }

    async criar(req, res, next) {
        try {
            const novaEntrega = await this.service.criar(req.body);
            res.json(novaEntrega);
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const entregaAtualizada = await this.service.atualizar(Number(req.params.id),
            req.body)
           
            res.json(entregaAtualizada);
        } catch (error) {
            next(error);
        }
    }

    async cancelar(req, res, next) {
        try {
            const entrega = await this.service.atualizar(req.params.id, {status: "CANCELADA"});
            res.json(entrega);
        } catch (error) {
            next(error);
        }

    }
}