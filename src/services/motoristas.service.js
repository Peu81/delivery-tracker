import { AppError } from "../utils/AppError.js";

export class motoristasService {
    constructor(repository) {
        this.repository = repository;
    }

    async criar(dadosMotorista) {
        const cpf = String(dadosMotorista.cpf);

        const motorista = await this.repository.buscarPorCpf(cpf);

        if (motorista) {
            throw new AppError("CPF já cadastrado no sistema.", 409);
        }

        const informacoesMotorista = {
            ...dadosMotorista,
            status: "ATIVO"
        }

        return this.repository.criar(informacoesMotorista);
    }

    async listarTodos(filtros) {
        return this.repository.listarTodos()
    }

    async buscarPorId(id) {
        const motorista = await this.repository.buscarPorId(Number(id));

        if (!motorista) {
            throw new AppError("Motorista não encontrado.", 404);
        }

        return motorista;
    }

    async inativaMotorista(id) {
        const motorista = await this.repository.buscarPorId(id);

        if (!motorista) {
            throw new AppError("Motorista não encontrado.", 404)           
        }

        motorista.status = "INATIVO"

        return this.repository.atualizar(id, motorista);
    }
}
