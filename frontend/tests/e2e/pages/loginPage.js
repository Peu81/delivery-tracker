export class LoginPage {
    constructor(page) {
        this.page = page;
        this.campoEmail = page.locator('[data-testid="input-email"]');
        this.campoSenha = page.locator('[data-testid="input-senha"]');
        this.botaoEntrar = page.locator('[data-testid="btn-login"]');
        this.alertaErro = page.locator('[data-testid="alerta-erro"]');
    }

    async navegar() {
        await this.page.goto('/painel/login');
    }

    async fazerLogin(email, senha) {
        await this.campoEmail.fill(email);
        await this.campoSenha.fill(senha);
        await this.botaoEntrar.click();
    }
}