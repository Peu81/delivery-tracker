export class motoristasController {
    constructor(service) {
        this.service = service;
        this.index = this.index.bind(this);
        this.novo = this.novo.bind(this);
    }

    async index(req, res, next) {
        try {
            const motoristas = await this.service.listarTodos(req.query.page, req.query.status);
            const flash = {sucesso: req.query.sucesso, erro: req.query.erro};

            res.render('motoristas/index', {titulo: 'Motoristas', motoristas, flash});
        } catch (error) {next(error)};
    }

    async formularioVazio(req, res, next) {
        res.render('motoristas/novo', {
            titulo: 'Cadastro de motorista.',
            entrega: {},
            erro: null
        })
    }

    async novo(req, res, next) {
        try {
            await this.service.criar(req.body);
            res.redirect('/painel/motoristas?sucesso=MotoristaCadastrado.')
        } catch (error) {
            res.render('motoristas/novo', {
                titulo: 'Cadastro de motorista.',
                motorista: req.body,
                erro: error.message
            })
        }
    }
}