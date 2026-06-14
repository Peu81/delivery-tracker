import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server.js';
import { prisma } from '../../src/config/dbInit.js';
import jwt from 'jsonwebtoken';

// Exigência do RF-04: Limpar o banco de dados antes de cada teste para garantir o isolamento
beforeEach(async () => {
    await prisma.usuario.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('POST /api/auth/registrar', () => {
    it('deve retornar 201 com o usuário criado e sem o campo senha para dados válidos', async () => {
        const resposta = await request(app)
            .post('/api/auth/registrar')
            .send({
                nome: 'Ana Silva',
                email: 'ana@ex.com',
                senha: 'senha12345'
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toHaveProperty('id');
        expect(resposta.body).toHaveProperty('email', 'ana@ex.com');
        // RF-04: Garantir que a senha não seja devolvida na resposta
        expect(resposta.body).not.toHaveProperty('senha'); 
    });

    it('deve retornar 400 quando a senha tem menos de 8 caracteres', async () => {
        const resposta = await request(app)
            .post('/api/auth/registrar')
            .send({
                nome: 'Ana',
                email: 'ana2@ex.com',
                senha: '1234'
            });

        expect(resposta.status).toBe(400);
    });

    it('deve retornar 409 quando o e-mail já está cadastrado', async () => {
        // 1. Cadastra a primeira vez
        await request(app)
            .post('/api/auth/registrar')
            .send({
                nome: 'Ana Original',
                email: 'ana@ex.com',
                senha: 'senha12345'
            });

        // 2. Tenta cadastrar de novo com o mesmo e-mail
        const resposta = await request(app)
            .post('/api/auth/registrar')
            .send({
                nome: 'Outra Ana',
                email: 'ana@ex.com', // E-mail duplicado
                senha: 'outrasenha'
            });

        expect(resposta.status).toBe(409);
    });
});

describe('POST /api/auth/login', () => {
    // Cadastra um usuário válido no banco antes de cada teste de login
    beforeEach(async () => {
        await request(app)
            .post('/api/auth/registrar')
            .send({
                nome: 'Ana',
                email: 'ana@ex.com',
                senha: 'senha12345'
            });
    });

    it('deve retornar 200 com accessToken e refreshToken para credenciais válidas', async () => {
        const resposta = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'ana@ex.com',
                senha: 'senha12345'
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveProperty('accessToken');
        expect(resposta.body).toHaveProperty('refreshToken');

        // Validação extra recomendada: garantir que o token JWT é válido e sem a senha
        const payload = jwt.decode(resposta.body.accessToken);
        expect(payload).toHaveProperty('email', 'ana@ex.com');
        expect(payload).not.toHaveProperty('senha');
    });

    it('deve retornar 401 com mensagem "Credenciais inválidas" para senha incorreta', async () => {
        const resposta = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'ana@ex.com',
                senha: 'senhaerrada'
            });

        expect(resposta.status).toBe(401);
        // Ajuste 'message' para 'erro' dependendo de como o seu AppError formata a resposta JSON
        expect(resposta.body.erro).toBe('Credenciais inválidas!'); 
    });

    it('deve retornar 401 com a mesma mensagem para e-mail inexistente', async () => {
        const resposta = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'inexistente@ex.com',
                senha: 'qualquer'
            });

        expect(resposta.status).toBe(401);
        expect(resposta.body.erro).toBe('Credenciais inválidas!');
    });
});