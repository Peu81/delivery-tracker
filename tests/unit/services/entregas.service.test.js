// tests/unit/services/EntregasService.test.js
import { describe, it, expect, jest } from '@jest/globals';
import { entregasService } from '../../../src/services/entregasService.js';
import { AppError } from '../../../src/utils/AppError.js';

function criarRepositorioFalso(overrides = {}) {
  return {
    criar: jest.fn(),
    buscarPorId: jest.fn(),
    atualizar: jest.fn(),
    entregasDuplicadas: jest.fn().mockResolvedValue(false),
    listarTodos: jest.fn(),
    historicoPorId: jest.fn(),
    listaPorMotorista: jest.fn(),
    ...overrides,
  };
}

function criarMotoristaRepoFalso(overrides = {}) {
  return {
    buscarPorId: jest.fn(),
    ...overrides,
  };
}

describe('EntregasService', () => {

  // BLOCO CONSULTAS E VALIDAÇÕES
  describe('Consultas e validações base (_entregaOuErro, listarTodos, buscarPorId, historicoPorId)', () => {
    
    it('deve lançar AppError 400 se o ID fornecido não for um número válido', async () => {
      const repoFalso = criarRepositorioFalso();
      const service = new entregasService(repoFalso);

      await expect(service.buscarPorId("id_invalido"))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('deve lançar AppError 404 se a entrega não for encontrada no banco', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue(null)
      });
      const service = new entregasService(repoFalso);

      await expect(service.buscarPorId(99))
        .rejects.toMatchObject({ statusCode: 404 });
    });

    it('deve retornar a lista completa ao chamar listarTodos', async () => {
      const listaFalsa = [{ id: 1 }, { id: 2 }];
      const repoFalso = criarRepositorioFalso({
        listarTodos: jest.fn().mockResolvedValue(listaFalsa)
      });
      const service = new entregasService(repoFalso);

      const resultado = await service.listarTodos();
      expect(resultado).toEqual(listaFalsa);
      expect(repoFalso.listarTodos).toHaveBeenCalled();
    });

    it('deve retornar o histórico da entrega se ela existir', async () => {
      const historicoFalso = [{ descricao: "Criada" }];
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1 }),
        historicoPorId: jest.fn().mockResolvedValue(historicoFalso)
      });
      const service = new entregasService(repoFalso);

      const resultado = await service.historicoPorId(1);
      expect(resultado).toEqual(historicoFalso);
      expect(repoFalso.historicoPorId).toHaveBeenCalledWith(1);
    });
  });

  // BLOCO CRIAR
  describe('criar', () => {
    
    it('deve lançar AppError com status 400 quando origem é igual ao destino', async () => {
      const repoFalso = criarRepositorioFalso();
      const service = new entregasService(repoFalso);
      
      const dadosEntrega = {
        motoristaId: 1,
        origem: 'Rua das Flores, 123',
        destino: 'Rua das Flores, 123'
      };

      await expect(service.criar(dadosEntrega))
        .rejects
        .toMatchObject({ statusCode: 400 });
        
      expect(repoFalso.criar).not.toHaveBeenCalled();
    });

    it('deve lançar AppError com status 409 quando há entrega duplicada em aberto para o mesmo motorista', async () => {
      const repoFalso = criarRepositorioFalso({
        entregasDuplicadas: jest.fn().mockResolvedValue({ 
          id: 99, 
          motoristaId: 1, 
          status: 'EM_TRANSITO' 
        })
      });
      
      const service = new entregasService(repoFalso);
      
      const dadosEntrega = {
        motoristaId: 1,
        origem: 'Galpão A',
        destino: 'Rua B, 200'
      };

      await expect(service.criar(dadosEntrega))
        .rejects
        .toMatchObject({ statusCode: 409 });

      expect(repoFalso.criar).not.toHaveBeenCalled();
    });

    it('deve criar a entrega com sucesso e chamar o repositório', async () => {
      const repoFalso = criarRepositorioFalso({
        criar: jest.fn().mockResolvedValue({ id: 1, status: 'CRIADA' })
      });
      const service = new entregasService(repoFalso);

      const dados = { origem: 'Rua A', destino: 'Rua B', descricao: 'Pacote' };
      await service.criar(dados);

      expect(repoFalso.criar).toHaveBeenCalled();
      expect(repoFalso.criar).toHaveBeenCalledWith(
        expect.objectContaining({
          origem: 'Rua A',
          historico: expect.arrayContaining([
            expect.objectContaining({ descricao: "Entrega 'CRIADA'." })
          ])
        })
      );
    });
  }); // <-- FIM DO BLOCO CRIAR (Aninhamento corrigido)

  // BLOCO AVANÇA STATUS
  describe('avancaStatus', () => {
    it('deve lançar erro 422 ao tentar avançar para EM_TRANSITO sem motorista', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'CRIADA' })
      });
      const service = new entregasService(repoFalso);

      await expect(service.avancaStatus(1))
        .rejects.toMatchObject({ statusCode: 422, message: "Não é possível iniciar o trânsito, pois nenhum motorista foi atribuído." });
    });

    it('deve lançar erro 409 se não houver um próximo status no fluxo', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'ENTREGUE', fk_id_motorista: 10 }) 
      });
      const service = new entregasService(repoFalso);

      await expect(service.avancaStatus(1))
        .rejects.toMatchObject({ statusCode: 409 });
    });

    it('deve avançar o status com sucesso chamando o método atualizar', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'CRIADA', fk_id_motorista: 10 }),
        atualizar: jest.fn().mockResolvedValue({ status: 'EM_TRANSITO' })
      });
      const service = new entregasService(repoFalso);
      
      const atualizarSpy = jest.spyOn(service, 'atualizar').mockResolvedValue(true);

      await service.avancaStatus(1);

      expect(atualizarSpy).toHaveBeenCalledWith(1, { status: "EM_TRANSITO" });
    });
  });

  // BLOCO ATUALIZAR
  describe('atualizar', () => {
    
    it('deve permitir a transição de CRIADA para EM_TRANSITO', async () => {
      const entregaExistente = { id: 1, status: 'CRIADA' };
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue(entregaExistente),
        atualizar: jest.fn().mockResolvedValue({ ...entregaExistente, status: 'EM_TRANSITO' })
      });
      const service = new entregasService(repoFalso);
      const resultado = await service.atualizar(1, { status: 'EM_TRANSITO' });

      expect(resultado.status).toBe('EM_TRANSITO');
      expect(repoFalso.atualizar).toHaveBeenCalledWith(1, expect.objectContaining({
        status: 'EM_TRANSITO'
      }));
    });

    it('deve permitir a transição de EM_TRANSITO para ENTREGUE preenchendo a dataEntrega', async () => {
      const entregaExistente = { id: 1, status: 'EM_TRANSITO' };
      const dataHoje = new Date().toISOString();
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue(entregaExistente),
        atualizar: jest.fn().mockResolvedValue({ 
          ...entregaExistente, status: 'ENTREGUE', dataEntrega: dataHoje 
        })
      });
      const service = new entregasService(repoFalso);
      const resultado = await service.atualizar(1, { status: 'ENTREGUE' });

      expect(resultado.status).toBe('ENTREGUE');
      expect(resultado).toHaveProperty('dataEntrega');
      expect(repoFalso.atualizar).toHaveBeenCalledWith(1, expect.objectContaining({
        status: 'ENTREGUE',
        dataEntrega: expect.any(String)
      }));
    });

    it('deve lançar AppError com status 422 na transição inválida de ENTREGUE para EM_TRANSITO', async () => {
      const entregaExistente = { id: 1, status: 'ENTREGUE' };
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue(entregaExistente)
      });
      const service = new entregasService(repoFalso);

      await expect(service.atualizar(1, { status: 'EM_TRANSITO' }))
        .rejects.toMatchObject({ statusCode: 422 });
      expect(repoFalso.atualizar).not.toHaveBeenCalled(); 
    });

    it('deve lançar AppError com status 422 na transição inválida de CRIADA direto para ENTREGUE', async () => {
      const entregaExistente = { id: 1, status: 'CRIADA' };
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue(entregaExistente)
      });
      const service = new entregasService(repoFalso);

      await expect(service.atualizar(1, { status: 'ENTREGUE' }))
        .rejects.toMatchObject({ statusCode: 422 });
      expect(repoFalso.atualizar).not.toHaveBeenCalled();
    });

    it('deve lançar erro 400 ao tentar CANCELAR uma entrega que não é CRIADA nem EM_TRANSITO', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'DEVOLVIDA' }) 
      });
      const service = new entregasService(repoFalso);

      await expect(service.atualizar(1, { status: 'CANCELADA' }))
        .rejects.toMatchObject({ statusCode: 400, message: "Só é possivel cancelar entregas 'CRIADAS' ou 'EM_TRANSITO'!" });
    });

    it('deve lançar erro 422 ao tentar setar ENTREGUE em uma entrega que não está EM_TRANSITO', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'DEVOLVIDA' }) 
      });
      const service = new entregasService(repoFalso);

      await expect(service.atualizar(1, { status: 'ENTREGUE' }))
        .rejects.toMatchObject({ statusCode: 422, message: "Entregas precisam estar 'EM_TRANSITO' para serem entregues!" });
    });

  });

  // BLOCO CANCELAR
  describe('cancelar', () => {
    
    it('deve cancelar com sucesso uma entrega com status CRIADA', async () => {
      const entregaExistente = { id: 1, status: 'CRIADA' };
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue(entregaExistente),
        atualizar: jest.fn().mockResolvedValue({ ...entregaExistente, status: 'CANCELADA' })
      });
      const service = new entregasService(repoFalso);

      const resultado = await service.cancelar(1);

      expect(resultado.status).toBe('CANCELADA');
      expect(repoFalso.atualizar).toHaveBeenCalledWith(1, expect.objectContaining({
        status: 'CANCELADA'
      }));
    });

    it('deve lançar AppError com status 422 ao tentar cancelar uma entrega ENTREGUE', async () => {
      const entregaExistente = { id: 1, status: 'ENTREGUE' };
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue(entregaExistente)
      });
      const service = new entregasService(repoFalso);

      await expect(service.cancelar(1))
        .rejects.toMatchObject({ statusCode: 422 });
      expect(repoFalso.atualizar).not.toHaveBeenCalled();
    });
  });

  // BLOCO ATRIBUI MOTORISTA
  describe('atribuiMotorista', () => {
    const motoristaRepoFalso = { buscarPorId: jest.fn() };

    it('deve lançar erro 422 se o status da entrega não for CRIADA', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'EM_TRANSITO' })
      });
      const service = new entregasService(repoFalso, motoristaRepoFalso);

      await expect(service.atribuiMotorista(1, 10))
        .rejects.toMatchObject({ statusCode: 422, message: "Só é possivel atribuir entregas com status 'CRIADA'." });
    });

    it('deve lançar erro 404 se o motorista não for encontrado', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'CRIADA' })
      });
      motoristaRepoFalso.buscarPorId.mockResolvedValue(null);
      const service = new entregasService(repoFalso, motoristaRepoFalso);

      await expect(service.atribuiMotorista(1, 10))
        .rejects.toMatchObject({ statusCode: 404, message: "Motorista inexistente." });
    });

    it('deve lançar erro 422 se o motorista não estiver ATIVO', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'CRIADA' })
      });
      motoristaRepoFalso.buscarPorId.mockResolvedValue({ id: 10, status: 'INATIVO' });
      const service = new entregasService(repoFalso, motoristaRepoFalso);

      await expect(service.atribuiMotorista(1, 10))
        .rejects.toMatchObject({ statusCode: 422, message: "Não é possível atribuir entregas para motoristas inativos." });
    });

    it('deve atribuir motorista com sucesso quando não há motorista anterior', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'CRIADA' }) 
      });
      motoristaRepoFalso.buscarPorId.mockResolvedValue({ id: 10, nome: 'Carlos', status: 'ATIVO' });
      const service = new entregasService(repoFalso, motoristaRepoFalso);

      await service.atribuiMotorista(1, 10);

      expect(repoFalso.atualizar).toHaveBeenCalledWith(1, expect.objectContaining({
        fk_id_motorista: 10,
        eventos: { create: { informacoes: 'Motorista Carlos atribuído.' } }
      }));
    });

    it('deve substituir motorista com sucesso quando já existia um', async () => {
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue({ id: 1, status: 'CRIADA', fk_motorista_id: 5 }) 
      });
      motoristaRepoFalso.buscarPorId.mockResolvedValue({ id: 10, nome: 'Ana', status: 'ATIVO' });
      const service = new entregasService(repoFalso, motoristaRepoFalso);

      await service.atribuiMotorista(1, 10);

      expect(repoFalso.atualizar).toHaveBeenCalledWith(1, expect.objectContaining({
        fk_id_motorista: 10,
        eventos: { create: { informacoes: 'Motorista anterior substituido por Ana.' } }
      }));
    });
  });

  // BLOCO LISTAR POR MOTORISTA
  describe('listaPorMotorista', () => {
    it('deve chamar o repositório repassando o ID do motorista e status', async () => {
      const repoFalso = criarRepositorioFalso();
      const service = new entregasService(repoFalso);

      await service.listaPorMotorista(10, 'EM_TRANSITO');

      expect(repoFalso.listaPorMotorista).toHaveBeenCalledWith(10, 'EM_TRANSITO');
    });
  });

});