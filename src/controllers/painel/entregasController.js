export class entregasController {
    constructor(service) {
        this.service = service;
        this.formularioVazio = this.formularioVazio.bind(this)
        this.detalhe = this.detalhe.bind(this);
        this.editar = this.editar.bind(this);
        this.index = this.index.bind(this);
        this.nova = this.nova.bind(this);
    }

    async index(req, res, next) {
        try {
            const entregas = await this.service.listarTodos(req.query.page, req.query.status);
            const flash = {sucesso: req.query.sucesso, erro: req.query.erro};

            res.render('entregas/index', {titulo: 'Entregas', entregas, flash});
        } catch (error) {next(error)};
    }

    async detalhe(req, res, next) {
        try {
            const entrega = await this.service.buscarPorId(Number(req.params.id));
            res.render('entregas/detalhe', {titulo: 'Informações da entrega: ', entrega});
        } catch (error) {next(error)};
    }

    async formularioVazio(req, res, next) {
        res.render('entregas/nova', {
            titulo: 'Nova entrega',
            entrega: {},
            erro: null
        })
    }
    
    async nova(req, res, next) {
        try {
            await this.service.criar(req.body);
            res.redirect('/painel/entregas?sucesso=EntregaCriada.');
        } catch (error) {
            res.render('entregas/nova', {
                titulo: 'Nova entrega',
                entrega: req.body,
                erro: error.message
            })
        };
    }

    async editar(req, res, next) {
        try {
            const entrega = await this.service.buscarPorId(Number(req.params.id));
            res.render('entregas/editar', {
                titulo: 'Editar entrega.', 
                entrega, 
                erros: []
            });
        } catch (error) {next(error)}
    }
}