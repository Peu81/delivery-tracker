export class motoristasController {
    constructor(service) {
        this.service = service;
    }

    async cadastrarMotorista(req, res, next) {
        try {
            const motorista = await this.service.cadastrarMotorista(req.body);
            res.status(201).json(motorista);
        } catch (error) {
            next(error)
        }
    }

    async listarMotoristas(req, res, next) {
        try {
            const motoristas = await this.service.listarMotoristas(req.params);
            res.status(200).json(motoristas);
        } catch (error) {
            next(error);
        }
    }

    async motoristaPorId(req, res, next) {
        try {
            const motorista = await this.service.motoristaPorId(Number(req.params.id));
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