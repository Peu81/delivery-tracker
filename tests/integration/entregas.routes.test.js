import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import {prisma} from '../../src/config/dbInit.js'; 
import jwt from 'jsonwebtoken';

beforeEach(async () => {
    await prisma.entrega.deleteMany(); 
    await prisma.usuario.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Segurança dos Endpoints Protegidos (/api/entregas)', () => {
    
    it('deve retornar 401 para requisição sem token', async () => {
        const resposta = await request(app)
            .get('/api/entregas');

        expect(resposta.status).toBe(401);
    });

    it('deve retornar 401 para requisição com token de assinatura inválida', async () => {
        const tokenFalsificado = jwt.sign(
            { id: 1, papel: 'OPERADOR' },
            'chave_secreta_errada_do_hacker'
        );

        const resposta = await request(app)
            .get('/api/entregas')
            .set('Authorization', `Bearer ${tokenFalsificado}`);

        expect(resposta.status).toBe(401);
    });

    it('deve retornar 401 com mensagem contendo "expirado" para requisição com token expirado', async () => {
        const tokenExpirado = jwt.sign(
        { id: 1, papel: 'OPERADOR' },
        process.env.JWT_SECRET,
        { expiresIn: -1 }
        );

        const resposta = await request(app)
            .get('/api/entregas')
            .set('Authorization', `Bearer ${tokenExpirado}`);

        expect(resposta.status).toBe(401);
        expect(resposta.body.erro).toMatch(/expirado/i); 
    });

    it('deve retornar 403 para usuário com papel OPERADOR acessando rota exclusiva de GESTOR', async () => {
        const tokenOperador = jwt.sign(
            { id: 1, papel: 'OPERADOR' },
            process.env.JWT_SECRET || 'secret'
        );

        const resposta = await request(app)
            .get('/api/motoristas/:id/entregas')
            .set('Authorization', `Bearer ${tokenOperador}`);

        expect(resposta.status).toBe(403);
    });

    it('deve retornar 403 para usuário OPERADOR tentando cancelar entrega', async () => {
        const tokenOperador = jwt.sign(
            { id: 1, papel: 'OPERADOR' },
            process.env.JWT_SECRET || 'secret'
        );

        const resposta = await request(app)
            .patch('/api/entregas/:id/cancelar') 
            .set('Authorization', `Bearer ${tokenOperador}`);

        expect(resposta.status).toBe(403);
    });

    it('deve retornar 200 para usuário GESTOR acessando a mesma rota restrita', async () => {
        const tokenGestor = jwt.sign(
            { id: 2, papel: 'GESTOR' },
            process.env.JWT_SECRET || 'secret'
        );

        const resposta = await request(app)
            .get('/api/motoristas/:id/entregas')
            .set('Authorization', `Bearer ${tokenGestor}`);

        expect(resposta.status).toBe(200);
    });
});