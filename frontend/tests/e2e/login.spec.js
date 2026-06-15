import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { prisma } from '../../../src/config/dbInit.js';
import bcrypt from 'bcrypt';

test.describe('Fluxos de Autenticação (Login)', () => {
    
    // Roda UMA VEZ antes de todos os testes apenas para garantir que o usuário existe
    test.beforeAll(async () => {
        const senhaCriptografada = await bcrypt.hash('adm12345', 10);
        
        await prisma.usuario.upsert({
            where: { email: 'pedro.adm@teste.com' },
            update: { senha: senhaCriptografada },
            create: {
                nome: 'Pedro',
                email: 'pedro.adm@teste.com',
                senha: senhaCriptografada,
                papel: 'GESTOR'
            }
        });
        await prisma.$disconnect(); 
    });

    // --- TESTE 1: Login Inválido  ---
    test('Credenciais incorretas exibem mensagem de erro visível e não redirecionam', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navegar();
        
        await loginPage.fazerLogin('pedro.adm@teste.com', 'senhaerrada');

        await expect(loginPage.alertaErro).toBeVisible();
        
        await expect(page).toHaveURL(/\/login/);
    });

    // --- TESTE 2: Login Válido ---
    test('Credenciais corretas redirecionam para /entregas', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navegar();
        
        await loginPage.fazerLogin('pedro.adm@teste.com', 'adm12345');

        // Verifica se o redirecionamento aconteceu com sucesso
        await expect(page).toHaveURL(/\/painel\/entregas/);
    });

    // --- TESTE 3: Acesso sem autenticação ---
    test('Navegar para /entregas sem token redireciona para /login', async ({ page }) => {
        await page.goto('/painel/entregas');

        await expect(page).toHaveURL(/\/login/);
    });
});