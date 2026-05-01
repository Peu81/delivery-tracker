export class motoristasController {
    constructor(service) {
        this.service = service;
    }

    async criar(req, res, next) {
        try {
            const motorista = await this.service.criar(req.body);
            res.status(201).json(motorista);
        } catch (error) {
            next(error)
        }
    }

    async listarTodos(req, res, next) {
        try {
            const motoristas = await this.service.listarTodos(req.params);
            res.status(200).json(motoristas);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const motorista = await this.service.buscarPorId(Number(req.params.id));
        res.status(200).json(motorista);
        } catch (error) {
            next(error);
        }
    }

    async inativaMotorista(req, res, next) {
        try {
            const motorista = await this.service.inativaMotorista(Number(req.params.id));
            res.status(200).json(motorista);
        } catch (error) {
            next(error);
        }
    }
    
}