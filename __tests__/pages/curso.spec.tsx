import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock global fetch
global.fetch = jest.fn();

describe('Curso Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('debe tener getServerSideProps definido', async () => {
    const module = await import('../../pages/curso/[id]');
    expect(module.getServerSideProps).toBeDefined();
    expect(typeof module.getServerSideProps).toBe('function');
  });

  it('getServerSideProps debe retornar notFound para id inválido', async () => {
    const { getServerSideProps } = await import('../../pages/curso/[id]');
    
    const result1 = await getServerSideProps({ query: {} } as any);
    expect(result1).toEqual({ notFound: true });

    const result2 = await getServerSideProps({ query: { id: 'abc' } } as any);
    expect(result2).toEqual({ notFound: true });

    const result3 = await getServerSideProps({ query: { id: '1abc' } } as any);
    expect(result3).toEqual({ notFound: true });
  });

  it('getServerSideProps debe retornar props para id válido', async () => {
    const mockData = { id: 1, titulo: 'Test Course', precio: 99.99 };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData)
    });

    const { getServerSideProps } = await import('../../pages/curso/[id]');
    
    const result = await getServerSideProps({ query: { id: '123' } } as any);
    expect(result).toEqual({ props: { data: mockData } });
  });
});