export class entregasController {
    constructor(service, motoristasService) {
        this.service = service;
        this.motoristasService = motoristasService;
        this.formularioVazio = this.formularioVazio.bind(this)
        this.detalhe = this.detalhe.bind(this);
        this.editar = this.editar.bind(this);
        this.index = this.index.bind(this);
        this.nova = this.nova.bind(this);
        this.avancarStatus = this.avancarStatus.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.atribuiMotorista = this.atribuiMotorista.bind(this);
    }

    async index(req, res, next) {
        try {
            const resultado = await this.service.listarTodos(req.query.page, req.query.status);

            console.log("RETORNO DO SERVICE:", resultado);
            
            const listaEntregas = resultado.data;

            const flash = {sucesso: req.query.sucesso, erro: req.query.erro};

            res.render('entregas/index', {
                titulo: 'Entregas', 
                entregas: listaEntregas, 
                paginaAtual: resultado.page, 
                totalPaginas: resultado.totalPaginas, 
                flash
            });
        } catch (error) {next(error)};
    }

    async detalhe(req, res, next) {
        try {
            const entrega = await this.service.buscarPorId(Number(req.params.id));
            const historico = await this.service.historicoPorId(Number(req.params.id));

            const motoristas = await this.motoristasService.listarTodos();
            const listaMotoristas = motoristas.data || motoristas;

            res.render('entregas/detalhe', {titulo: 'Informações da entrega: ', entrega, historico, motoristas: listaMotoristas});
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

    async avancarStatus(req, res, next) {
        try {
            const id = Number(req.params.id);
            await this.service.avancaStatus(id);

            res.redirect(`/painel/entregas/${id}?sucesso=Status avancado com sucesso.`);
        } catch (error) {
            res.redirect(`/painel/entregas/${req.params.id}?erro=${error.message}`);
        }
    }

    async cancelar(req, res, next) {
        try {
            const id = Number(req.params.id);
            await this.service.cancelar(id); 
            
            res.redirect(`/painel/entregas/${id}?sucesso=Entrega cancelada.`);
        } catch (error) {
            res.redirect(`/painel/entregas/${req.params.id}?erro=${error.message}`);
        }
    }

    async atribuiMotorista(req, res, next) {
        try {
            const id = Number(req.params.id);
            const motoristaId = Number(req.body.motoristaId);

            await this.service.atribuiMotorista(id, motoristaId);

            res.redirect(`/painel/entregas/${id}?sucesso=motoristaAtribuido`)

        } catch (error) {
           res.redirect(`/painel/entregas/${req.params.id}?erro=${error.message}`);
        }
    }
}