/**
@implements {IUsuariosRepository}
*/

export class usuariosRepository {
    constructor(prisma) {
        this.prisma = prisma
    }

    async criar(dados) {
        try {
            return await this.prisma.usuario.create({data: {
                nome: dados.nome, 
                email: dados.email, 
                senha: dados.senha, 
                papel: dados.papel 
            }})
        } catch (error) {
            throw new Error("erro teste", error);
            
        }
    }

    async buscarPorEmail(email) {
        return await this.prisma.usuario.findUnique({where: {email: email}})
    }
}