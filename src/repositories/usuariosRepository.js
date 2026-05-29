
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
            if (error.code === 'P2002' || error.message.includes('UNIQUE constraint failed')) {
                throw new AppError("E-mail já cadastrado.", 409);
            }  
        }
    }

    async buscarPorEmail(email) {
        return await this.prisma.usuario.findUnique({where: {email}})
    }
}