export class EntregasPage {
    constructor(page) {
        this.page = page;
        this.tabelaEntregas = page.locator('[data-testid="tabela-entregas"]');
        this.linhasDaTabela = this.tabelaEntregas.locator('tbody tr');
        this.botaoSair = page.locator('[data-testid="btn-sair"]');
    }

    async navegar() {
        await this.page.goto('/painel/entregas');
    }

    async fazerLogout() {
        await this.botaoSair.click();
    }
}