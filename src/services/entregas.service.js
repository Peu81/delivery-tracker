import { AppError } from "../utils/AppError.js";

const fluxoEntrega = {
    "CRIADA": "EM_TRANSITO",
    "EM_TRANSITO": "ENTREGUE"
}


export class entregasService {
    constructor(entregasRepository, motoristasRepository) {
        this.repository = entregasRepository;
        this.motoristasRepository = motoristasRepository;
    }

    async listarTodos(status) {
        if (status) {
            return this.repository.listarPorStatus(status);
        }
        return this.repository.listarTodos();
    }
    
    async buscarPorId(id) {
        return this._entregaOuErro(id);
    }

    async historicoPorId(id) {
        await this._entregaOuErro(id);
        return this.repository.historicoPorId(id);
    }

    async criar(dados) {
        if (dados.origem.trim() === dados.destino.trim()) {
            throw new AppError("Origem e destino não podem ser iguais.", 400);
        }

        const entregaDuplicada = await this.repository.entregasDuplicadas(
            dados.descricao, 
            dados.origem, 
            dados.destino);

        if (entregaDuplicada) {
            throw new AppError("Entrega duplicada! Já existe uma entrega com essas informações", 409);
        }

        const historicoInicial = {
            data: new Date().toISOString().split('T')[0],
            descricao: "Entrega 'CRIADA'."
        }

        const entrega = {
            ...dados,
            historico: [historicoInicial]
        }

        return this.repository.criar(entrega);
    }

    async avancaStatus(id) {
        const entrega = await this._entregaOuErro(Number(id));
        const proximoStatus = fluxoEntrega[entrega.status];

        if (!proximoStatus) {
            throw new AppError(`Não é possível avançar. Status atual: '${entrega.status}'`, 409);   
        }
         
        return this.atualizar(Number(id), {"status": proximoStatus});
    }

    async cancelar(id) {
        return await this.atualizar(id, {status: "CANCELADA"});
    }

    async atualizar(id, dados) {
        const entregaExiste = await this._entregaOuErro(id);
 
        if (entregaExiste.status === "ENTREGUE" || entregaExiste.status === "CANCELADA") {
            throw new AppError("O status não pode ser alterado.", 409);
        }

        if (dados.status === "CANCELADA"){
            if (entregaExiste.status !== "CRIADA" && entregaExiste.status !== "EM_TRANSITO") {
            throw new AppError("Só é possivel cancelar entregas 'CRIADAS' ou 'EM_TRANSITO'!", 400);
        }}
        
        if (dados.status === "ENTREGUE") {
            if (entregaExiste.status === "CRIADA"){ 
            throw new AppError("Uma entrega recem criada não pode receber o status 'ENTREGUE' sem estar 'EM_TRANSITO'.", 422);
            }; 

            if (entregaExiste.status !== "EM_TRANSITO") {
            throw new AppError("Entregas precisam estar 'EM_TRANSITO' para serem entregues!", 422);         
            }      
        }
        
        const novoHistorico = {
            data: new Date().toISOString().split('T')[0],
            descricao: `Status alterado para: ${dados.status}`
        }

        const dadosAtualizados = {
            ...entregaExiste,
            status: dados.status,
            historico: [...entregaExiste.historico, novoHistorico]
        }

        return this.repository.atualizar(id, dadosAtualizados);
    }


    async atribuiMotorista(entregaId, motoristaId) {
        const entregaExiste = await this._entregaOuErro(entregaId)

        if (entregaExiste.status !== "CRIADA") {
            throw new AppError("Só é possivel atribuir entregas com status 'CRIADA'.", 409);         
        }

        const motorista = await this.motoristasRepository.buscarPorId(motoristaId);

        if (!motorista) {
            throw new AppError("Motorista inexistente.", 404);
        }

        if (motorista.status !== "ATIVO") {
            throw new AppError("Não é possível atribuir entregas para motoristas inativos.", 422); 
        }

        let mensagem = ""; 

        if (!entregaExiste.motoristaId) {
            mensagem = `Motorista ${motorista.nome} atribuído.`;
        }

        else {
            mensagem = `Motorista anterior substituido por ${motorista.nome}.`
        }
        
        const novoHistorico = {
        data: new Date().toISOString().split('T')[0],
        descricao: mensagem
        }

        const dadosAtualizados = {
            ...entregaExiste,
            motoristaId: motoristaId,
            historico: [...entregaExiste.historico, novoHistorico]
        }
        return this.repository.atualizar(entregaId, dadosAtualizados);        
    }

    async listaPorMotorista(motoristaId, status) {
        return this.repository.listaPorMotorista(motoristaId, status);
    }

    async _entregaOuErro(id) {
        const numId = Number(id);

        if (isNaN(numId)) {
            throw new AppError("ID inválido", 400);
        }

        const entrega = await this.repository.buscarPorId(numId);

        if (!entrega) {
            throw new AppError("Entrega inexistente!", 404);
        }
    
        return entrega;
    }
}


