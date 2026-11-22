import { authErrorMessage, retryAfterSeconds } from '../../utils/api-error';

/** Error de axios con la respuesta que el backend devuelve (ApiError body). */
const httpError = (status: number, headers?: Record<string, string>) => ({
    isAxiosError: true,
    response: { status, headers, data: {} },
    config: { method: 'get', url: '/usuarios/1/cursos' }
});

describe('retryAfterSeconds', () => {
    it('lee Retry-After en mayúsculas (mocks) y en minúsculas (axios normaliza)', () => {
        expect(retryAfterSeconds(httpError(429, { 'Retry-After': '45' }))).toBe(45);
        expect(retryAfterSeconds(httpError(429, { 'retry-after': '90' }))).toBe(90);
    });

    it('acepta el valor numérico directo', () => {
        expect(retryAfterSeconds({ response: { status: 429, headers: { 'retry-after': 30 } } })).toBe(30);
    });

    it('devuelve 0 si la cabecera no viene o no es un número positivo', () => {
        expect(retryAfterSeconds(httpError(429))).toBe(0);
        expect(retryAfterSeconds(httpError(429, {}))).toBe(0);
        expect(retryAfterSeconds(httpError(429, { 'retry-after': 'abc' }))).toBe(0);
        expect(retryAfterSeconds(httpError(429, { 'retry-after': '-5' }))).toBe(0);
    });

    it('devuelve 0 para errores sin respuesta', () => {
        expect(retryAfterSeconds(new Error('network'))).toBe(0);
        expect(retryAfterSeconds(undefined)).toBe(0);
    });
});

describe('authErrorMessage', () => {
    it('da el aviso de credenciales con 401', () => {
        expect(authErrorMessage(httpError(401))).toBe('No se ha podido logear, revise usuario/contraseña');
    });

    it('da el aviso de permisos con 403', () => {
        expect(authErrorMessage(httpError(403))).toBe('No tiene permiso para realizar esta operación');
    });

    it('muestra los segundos de Retry-After con 429', () => {
        expect(authErrorMessage(httpError(429, { 'Retry-After': '120' })))
            .toBe('Demasiados intentos seguidos, vuelva a intentarlo en 120 segundos');
    });

    it('cae en el mensaje genérico de bloqueo si el 429 no trae Retry-After', () => {
        expect(authErrorMessage(httpError(429)))
            .toBe('Demasiados intentos seguidos, espere unos minutos y vuelva a intentarlo');
    });

    it('cae en el aviso de credenciales para el resto de fallos', () => {
        expect(authErrorMessage(new Error('sin conexión'))).toBe('No se ha podido logear, revise usuario/contraseña');
        expect(authErrorMessage(httpError(500))).toBe('No se ha podido logear, revise usuario/contraseña');
        expect(authErrorMessage(undefined)).toBe('No se ha podido logear, revise usuario/contraseña');
    });
});
