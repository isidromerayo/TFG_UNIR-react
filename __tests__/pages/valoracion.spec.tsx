import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock global fetch
global.fetch = jest.fn();

describe('Valoracion Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('debe tener getServerSideProps definido', async () => {
    const module = await import('../../pages/valoracion/[id]');
    expect(module.getServerSideProps).toBeDefined();
    expect(typeof module.getServerSideProps).toBe('function');
  });

  it('getServerSideProps debe retornar notFound para id inválido', async () => {
    const { getServerSideProps } = await import('../../pages/valoracion/[id]');
    
    const result1 = await getServerSideProps({ query: {} } as any);
    expect(result1).toEqual({ notFound: true });

    const result2 = await getServerSideProps({ query: { id: 'abc' } } as any);
    expect(result2).toEqual({ notFound: true });
  });

  it('getServerSideProps debe retornar props para id válido', async () => {
    const mockValoracion = { id: 1, puntuacion: 5, comentario: 'Excelente' };
    const mockCurso = { id: 1, titulo: 'Test Course' };
    const mockAlumno = { id: 1, nombre: 'Test', apellidos: 'User' };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockValoracion) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockCurso) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockAlumno) });

    const { getServerSideProps } = await import('../../pages/valoracion/[id]');
    
    const result = await getServerSideProps({ query: { id: '1' } } as any);
    expect(result).toEqual({ 
      props: { 
        data: { 
          valoracion: mockValoracion, 
          curso: mockCurso, 
          alumno: mockAlumno 
        } 
      } 
    });
  });
});