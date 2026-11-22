import type { AxiosError } from 'axios';

/**
 * Cabeceras de respuesta normalizadas por axios (claves en minúsculas); los
 * tests y mocks pueden pasar el nombre original `Retry-After`.
 */
function retryAfterHeader(err: unknown): unknown {
    const headers = (err as AxiosError | undefined)?.response?.headers as
        | Record<string, unknown>
        | undefined;
    return headers?.['retry-after'] ?? headers?.['Retry-After'];
}

/**
 * Segundos que el backend pide esperar mediante la cabecera `Retry-After`
 * (límite de intentos de acceso en `security/LoginRateLimiter`). Devuelve 0
 * si la cabecera no viene o no es un número positivo.
 */
export function retryAfterSeconds(err: unknown): number {
    const seconds = Number(retryAfterHeader(err));
    return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
}

/**
 * Mensaje específico para fallos de acceso (login) según el estado HTTP:
 *  - 401: credenciales incorrectas.
 *  - 403: sin permiso (el backend lo reserva para id ajenos al token).
 *  - 429: bloqueo por intentos, mostrando los segundos de `Retry-After`.
 * Cualquier otro caso (red, timeout, error plano) cae en el aviso de
 * credenciales, como hacía el mensaje genérico anterior.
 */
export function authErrorMessage(err: unknown): string {
    const status = (err as AxiosError | undefined)?.response?.status;
    if (status === 403) {
        return 'No tiene permiso para realizar esta operación';
    }
    if (status === 429) {
        const espera = retryAfterSeconds(err);
        return espera > 0
            ? `Demasiados intentos seguidos, vuelva a intentarlo en ${espera} segundos`
            : 'Demasiados intentos seguidos, espere unos minutos y vuelva a intentarlo';
    }
    return 'No se ha podido logear, revise usuario/contraseña';
}
