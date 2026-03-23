export class entregasService {
    constructor(repository) {
        this.repository = repository;
    }

    async listarTodos(status) {
        if (status) {
            return this.repository.listarPorStatus(status)
        }
        return this.repository.listarTodos();
    }
    
    async buscarPorId(id) {
        return this.repository.buscarPorId(id);
    }

    async historicoPorId(id) {
        return this.repository.historicoPorId(id);
    }

    async criar(dados) {
        if (dados.origem.trim() === dados.destino.trim()) {
            throw new Error("Origem e destino não podem ser iguais.");
        }

        if (dados.status !== "CRIADA") {
            throw new Error("O status inicial não pode ser diferente de 'CRIADA'");
        }

        const historicoInicial = {
            data: new Date().toISOString().split('T')[0],
            descricao: "Entrega criada"
        }

        const entrega = {
            ...dados,
            historico: [historicoInicial]
        }

        return this.repository.criar(entrega);
    }

    async atualizar(id, dados) {
        const entregaExiste = await this.repository.buscarPorId(Number(id));
        if (!entregaExiste) {
            throw new Error("Entrega não existe");
        }

        if (entregaExiste.status === "ENTREGUE" || entregaExiste.status === "CANCELADA") {
            throw new Error("O status não pode ser alterado.");
        }

        if (dados.status === "CANCELADA"){
            if (entregaExiste.status !== "CRIADA" && entregaExiste.status !== "EM_TRANSITO") {
                throw new Error("Só é possivel cancelar entregas 'CRIADAS' ou 'EM_TRANSITO'!");
        }}
        
        if (dados.status === "ENTREGUE") {
            if (entregaExiste.status === "CRIADA"){ 
                throw new Error("Uma entrega recem criada não pode receber o status 'ENTREGUE' sem estar 'EM_TRANSITO'.")
            }; 

            if (entregaExiste.status !== "EM_TRANSITO") {
                throw new Error("Entregas precisam estar 'EM_TRANSITO' para serem entregues!");
            
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
}