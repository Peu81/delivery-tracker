import { describe, it, expect, jest } from '@jest/globals';
import { usuariosService } from '../../../src/services/usuariosService.js';
import { AppError } from '../../../src/utils/AppError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


function criarRepositorioFalso(overrides = {}) {
  return {
    criar: jest.fn(),
    buscarPorEmail: jest.fn(),
    login: jest.fn(),
    ...overrides,
  };
}

describe('AuthServices', () => {

    describe('login', () => {
        it('Lança AppError 401 com mensagem "Credenciais inválidas" ao digitar email inexistente.', async () => {
            const repoFalso = criarRepositorioFalso(
                {buscarPorEmail: jest.fn().mockResolvedValue(null)
                });
            const service = new usuariosService(repoFalso);

            const dadosLogin = {
                email: 'emailInexistente@teste.com',
                senha: '12345678'
            };

            await expect(service.login(dadosLogin))
                .rejects
                .toMatchObject({
                    message: "Credenciais inválidas!",
                    statusCode: 401
                });
        });

        it('Lança AppError 401 com mensagem "Credenciais inválidas" ao digitar senha incorreta.', async () => {
            const usuarioFalso = {
                id: 1,
                nome: 'Pedro',
                email: 'pedro.teste@exemplo.com',
                senha: 'hashDaSenha',
                papel: 'OPERADOR'
            };

            const repoFalso = criarRepositorioFalso(
                {buscarPorEmail: jest.fn().mockResolvedValue(usuarioFalso)
                });
            const service = new usuariosService(repoFalso);

            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            const dadosLogin = {email: 'pedro.teste@exemplo.com', senha: 'senhaincorreta'};

            await expect(service.login(dadosLogin))
                .rejects
                .toMatchObject({
                    message: "Credenciais inválidas!",
                    statusCode: 401
                });
            });
        it('deve retornar accessToken, refreshToken e o objeto usuario sem a senha em caso de sucesso', async () => {
            const usuarioFalso = {
                id: 1,
                nome: 'Pedro',
                email: 'pedro.teste@exemplo.com',
                senha: 'hashDaSenha',
                papel: 'OPERADOR'
            };

            const repoFalso = criarRepositorioFalso({
                buscarPorEmail: jest.fn().mockResolvedValue(usuarioFalso)
            });
            const service = new usuariosService(repoFalso);

            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            jest.spyOn(jwt, 'sign').mockReturnValue('token_jwt_falso_123');

            const resultado = await service.login({ email: 'pedro.teste@exemplo.com', senha: 'senhacorreta' });

            expect(resultado).toHaveProperty('accessToken');
            expect(resultado).toHaveProperty('refreshToken');
            expect(resultado.usuario).toBeDefined();
            expect(resultado.usuario).not.toHaveProperty('senha');
        });

    });

    describe('cadastro', () => {
        it('Lança AppError 409 ao tentar cadastrar com email existente.', async () => {
            const cadastroFalso = {
                id: 1,
                nome: 'Pedro Augusto',
                email: 'pedro.teste@exemplo.com',
                senha: 'hashdasenha',
                papel: 'OPERADOR'
            };

            const repoFalso = criarRepositorioFalso({
                buscarPorEmail: jest.fn().mockResolvedValue(cadastroFalso)
            });
            const service = new usuariosService(repoFalso); 
            
            const dadosNovoUsuario = {
                nome: 'Pedro Teixeira',
                email: 'pedro.teste@gmail.com',
                senha: '12345678'
            };

            await expect(service.criar(dadosNovoUsuario))
                .rejects
                .toMatchObject({
                    message: "E-mail já cadastrado!",
                    statusCode: 409
                });
            
            expect(repoFalso.criar).not.toHaveBeenCalled();
        });
        
        it('Cadastrado com sucesso e bcrypt.hash antes de salvar', async () => {
            const repoFalso = criarRepositorioFalso({
                buscarPorEmail: jest.fn().mockResolvedValue(null),
                criar: jest.fn().mockResolvedValue({ 
                    id: 2, 
                    nome: 'Maria', 
                    email: 'maria.teste@exemplo.com', 
                    papel: 'OPERADOR' 
                })
            });
            const service = new usuariosService(repoFalso); 

            const spyHash = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hash_gerado_falso');
            
            const dadosValidos = {
                nome: 'Maria',
                email: 'maria.teste@exemplo.com',
                senha: 'senhaSuperSegura'
            };

            const resultado = await service.criar(dadosValidos);

            expect(resultado).toHaveProperty('id');
            
            expect(spyHash).toHaveBeenCalledWith('senhaSuperSegura', 10);

            expect(repoFalso.criar).toHaveBeenCalledWith(expect.objectContaining({
                nome: 'Maria',
                email: 'maria.teste@exemplo.com',
                senha: 'hash_gerado_falso',
                papel: 'OPERADOR'
        }));    
    });

});
});