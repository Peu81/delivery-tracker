import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o Seed do banco de dados...");

  // Criando 3 motoristas (RF-06)
  const motorista1 = await prisma.motorista.create({
    data: { nome: 'Carlos Silva', cpf: '11111111111', placaVeiculo: 'ABC-1234' }
  });
  const motorista2 = await prisma.motorista.create({
    data: { nome: 'Ana Souza', cpf: '22222222222', placaVeiculo: 'XYZ-9876' }
  });
  const motorista3 = await prisma.motorista.create({
    data: { nome: 'Pedro Santos', cpf: '33333333333', placaVeiculo: 'DEF-5678', status: 'INATIVO' }
  });

  console.log("Motoristas criados.");

  // Criando entregas e histórico atrelado
  await prisma.entrega.createMany({
    data: [
      { descricao: 'Pacote 1', origem: 'Galpão A', destino: 'Rua M', status: 'EM_TRANSITO', fk_id_motorista: motorista1.id },
      { descricao: 'Pacote 2', origem: 'Galpão B', destino: 'Rua N', status: 'CRIADA', fk_id_motorista: motorista2.id },
      { descricao: 'Pacote 3', origem: 'Galpão C', destino: 'Rua O', status: 'ENTREGUE', fk_id_motorista: motorista1.id },
      { descricao: 'Pacote 4', origem: 'Galpão C', destino: 'Rua P', status: 'CANCELADA', fk_id_motorista: motorista2.id },
      { descricao: 'Pacote 5', origem: 'Galpão A', destino: 'Rua Q', status: 'ENTREGUE', fk_id_motorista: motorista1.id },
      { descricao: 'Pacote 6', origem: 'Galpão B', destino: 'Rua R', status: 'EM_TRANSITO', fk_id_motorista: motorista2.id },
      { descricao: 'Pacote 7', origem: 'Galpão B', destino: 'Rua S', status: 'ENTREGUE', fk_id_motorista: motorista1.id },
      { descricao: 'Pacote 8', origem: 'Galpão C', destino: 'Rua T', status: 'CANCELADA', fk_id_motorista: motorista2.id },
      { descricao: 'Pacote 9', origem: 'Galpão A', destino: 'Rua U', status: 'CRIADA', fk_id_motorista: motorista1.id },
      { descricao: 'Pacote 10', origem: 'Galpão C', destino: 'Rua V', status: 'ENTREGUE', fk_id_motorista: motorista2.id }
    ]
  });

  console.log("Entregas de demonstração criadas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });