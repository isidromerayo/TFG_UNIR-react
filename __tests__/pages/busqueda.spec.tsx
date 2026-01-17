import { describe, it, expect } from '@jest/globals';

describe('Busqueda Page', () => {
  it('debe tener getServerSideProps definido', async () => {
    const pageModule = await import('../../pages/busqueda/[query]');
    expect(pageModule.getServerSideProps).toBeDefined();
    expect(typeof pageModule.getServerSideProps).toBe('function');
  });

  it('getServerSideProps debe retornar notFound para query inválido', async () => {
    const { getServerSideProps } = await import('../../pages/busqueda/[query]');
    
    const result1 = await getServerSideProps({ query: {} } as any);
    expect(result1).toEqual({ notFound: true });

    const result2 = await getServerSideProps({ query: { query: ['array'] } } as any);
    expect(result2).toEqual({ notFound: true });
  });

  it('getServerSideProps debe retornar props para query válido', async () => {
    const { getServerSideProps } = await import('../../pages/busqueda/[query]');
    
    const result = await getServerSideProps({ query: { query: 'react' } } as any);
    expect(result).toEqual({ props: { query_string: 'react' } });
  });
});