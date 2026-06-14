// tests/unit/services/EntregasService.test.js
import { describe, it, expect, jest } from '@jest/globals';
import { entregasService } from '../../../src/services/entregasService.js';
import { AppError } from '../../../src/utils/AppError.js';

function criarRepositorioFalso(overrides = {}) {
  return {
    criar: jest.fn(),
    buscarPorId: jest.fn(),
    atualizar: jest.fn(),
    ...overrides,
  };
}

describe('EntregasService', () => {
  
  //BLOCO CRIAR
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
        .toMatchObject({
          statusCode: 400
        });
        
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
        .toMatchObject({
          statusCode: 409
        });

      expect(repoFalso.criar).not.toHaveBeenCalled();
    });

  //BLOCO ATUALIZAR
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
          ...entregaExistente, 
          status: 'ENTREGUE', 
          dataEntrega: dataHoje 
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
        .rejects
        .toMatchObject({ statusCode: 422 });

      expect(repoFalso.atualizar).not.toHaveBeenCalled(); 
    });

    it('deve lançar AppError com status 422 na transição inválida de CRIADA direto para ENTREGUE', async () => {

      const entregaExistente = { id: 1, status: 'CRIADA' };
      const repoFalso = criarRepositorioFalso({
        buscarPorId: jest.fn().mockResolvedValue(entregaExistente)
      });
      const service = new entregasService(repoFalso);

      await expect(service.atualizar(1, { status: 'ENTREGUE' }))
        .rejects
        .toMatchObject({ statusCode: 422 });
        
      expect(repoFalso.atualizar).not.toHaveBeenCalled();
    });

  });

  //BLOCO CANCELAR
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
        .rejects
        .toMatchObject({ statusCode: 422 });
        
      expect(repoFalso.atualizar).not.toHaveBeenCalled();
    });
    
  });

  });
});