export class usuariosController {
    constructor(service) {
        this.service = service
    }

    async criar(req, res, next) {
        try {
            const usuario = await this.service.criar(req.body);
            
            delete usuario.senha;

            res.status(201).json(usuario);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const login = await this.service.login(req.body);
            res.status(200).json(login);
        } catch (error) {
            next(error);
        }
    }
}