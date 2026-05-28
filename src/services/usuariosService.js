import { AppError } from "../utils/AppError.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class usuariosService {
    constructor(repository) {
        this.repository = repository
    }

    async criar(dados) {

        const usuario = await this.repository.buscarPorEmail(dados.email);

        if (usuario) {
            throw new AppError("E-mail já cadastrado!", 409);
        }

        const senhaHash = await bcrypt.hash(dados.senha, 10);

        const informacoesUsuario = {
            ...dados,
            senha: senhaHash,
            papel: 'OPERADOR'
        }

        return this.repository.criar(informacoesUsuario);
    }

    async login(dados) {
        const usuario = await this.repository.buscarPorEmail(dados.email);

        if (!usuario) {
            throw new AppError("E-mail ou senha inválidos", 401);
        }

        const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);

        if (!senhaValida) {
            throw new AppError("E-mail ou senha inválidos", 401);
        }

        const payload = {
            id: usuario.id, 
            nome: usuario.nome, 
            email: usuario.email, 
            papel: usuario.papel
        }

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
        return { accessToken }
    }
}