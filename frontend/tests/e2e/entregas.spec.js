import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { EntregasPage } from './pages/EntregasPage.js';
import { prisma } from '../../../src/config/dbInit.js';
import bcrypt from 'bcrypt';

test.describe('Fluxos da Tela de Entregas', () => {
    
    test.beforeAll(async () => {
        let motorista = await prisma.motorista.upsert({
            where: { cpf: '11111111111' },
            update: {}, 
            create: {
                nome: 'João Pedro',
                cpf: '11111111111',
                placaVeiculo: 'AAAA-111'
            }
        });

        await prisma.entrega.create({
            data: {
                descricao: 'Pacote de Teste E2E',
                origem: 'Sede Delivery Tracker',
                destino: 'Casa do Cliente',
                status: 'CRIADA',
                motorista: { connect: { cpf: motorista.cpf } } 
            }
        });
        await prisma.$disconnect();
    });

    test.afterAll(async () => {

        await prisma.entrega.deleteMany({
            where: { descricao: 'Pacote de Teste E2E' }
        });
    });


    let emailUnico = '';

    test.beforeEach(async ({ page }) => {
        emailUnico = `gestor_${Date.now()}@teste.com`;
        const senhaCriptografada = await bcrypt.hash('adm12345', 10);
        

        await prisma.usuario.create({
            data: {
                nome: 'Pedro',
                email: emailUnico,
                senha: senhaCriptografada,
                papel: 'GESTOR'
            }
        });


        const loginPage = new LoginPage(page);
        await loginPage.navegar();
        await loginPage.fazerLogin(emailUnico, 'adm12345'); 
        
        try {
            await expect(page).toHaveURL(/\/painel\/entregas/, { timeout: 8000 });
        } catch (error) {
            const alerta = page.locator('[data-testid="alerta-erro"]');
            await page.waitForLoadState('domcontentloaded');
            if (await alerta.isVisible()) {
                console.error('\n🚨 O BACKEND RECUSOU O LOGIN. MOTIVO:', await alerta.innerText(), '\n');
            }
            throw error;
        }
    });

    test('Após login, a tabela de entregas é exibida com ao menos uma linha', async ({ page }) => {
        const entregasPage = new EntregasPage(page);
        
        await expect(entregasPage.tabelaEntregas).toBeVisible();
        const quantidadeLinhas = await entregasPage.linhasDaTabela.count();
        expect(quantidadeLinhas).toBeGreaterThan(0);
    });

    test('Clicar em "Sair" redireciona para /login e impede acesso a /entregas', async ({ page }) => {
        const entregasPage = new EntregasPage(page);
        await entregasPage.fazerLogout();
        
        await expect(page).toHaveURL(/\/login/);
        
        await entregasPage.navegar();
        await expect(page).toHaveURL(/\/login/);
    });
});