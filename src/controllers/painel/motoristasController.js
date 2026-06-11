export class motoristasController {
    constructor(motoristasService, entregasService) {
        this.motoristasService = motoristasService;
        this.entregasService = entregasService;
        this.index = this.index.bind(this);
        this.novo = this.novo.bind(this);
        this.listarEntregas = this.listarEntregas.bind(this);
    }

    async index(req, res, next) {
        try {
            const motoristas = await this.motoristasService.listarTodos(req.query.page, req.query.status);
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
            await this.entregasService.criar(req.body);
            res.redirect('/painel/motoristas?sucesso=MotoristaCadastrado.')
        } catch (error) {
            res.render('motoristas/novo', {
                titulo: 'Cadastro de motorista.',
                motorista: req.body,
                erro: error.message
            })
        }
    }

    async listarEntregas(req, res, next) {
        try {
            const motoristaId = Number(req.params.id);

            const motorista = await this.motoristasService.buscarPorId(motoristaId);
            const entregas = await this.entregasService.listaPorMotorista(motoristaId, req.query.status);

            res.render('motoristas/entregas', {titulo: `Entregas de ${motorista.nome}`, motorista, entregas});

        } catch (error) {
            next(error);            
        }
    }
}