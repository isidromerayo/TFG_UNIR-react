import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Curso Page', () => {
  it('debe tener el componente por defecto definido', async () => {
    const module = await import('../../pages/curso/[id]');
    expect(module.default).toBeDefined();
    expect(typeof module.default).toBe('function');
  });

  it('debe ser un componente React válido', async () => {
    const CursoComponent = (await import('../../pages/curso/[id]')).default;
    expect(CursoComponent.name).toBe('CursoPage');
  });

  it('debe exportar el componente como default', async () => {
    const module = await import('../../pages/curso/[id]');
    expect(module.default).toBeDefined();
    // Verificar que no tiene getServerSideProps (ahora es CSR)
    expect(module.getServerSideProps).toBeUndefined();
  });
});