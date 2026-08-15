import { TOKEN, USER } from '../utils/constants'
import { logger } from '../utils/logger'
import type { Usuario } from '../types'

function isBrowser(): boolean {
    return (globalThis as { window?: Window }).window !== undefined;
}

export function setToken(token: string): void {
    if (isBrowser()) {
        localStorage.setItem(TOKEN, token)
    }
}

export function getToken(): string {
    if (isBrowser()) {
        return localStorage.getItem(TOKEN) || '';
    }
    return '';
}

export function removeToken(): void {
    if (isBrowser()) {
        localStorage.removeItem(TOKEN);
    }
}

export function setUser(user: Usuario | string): void {
    if (isBrowser()) {
        localStorage.setItem(USER, typeof user === 'string' ? user : JSON.stringify(user));
    }
}

export function getUser(): Usuario | null {
    if (isBrowser()) {
        try {
            const user = localStorage.getItem(USER);
            return user ? (JSON.parse(user) as Usuario) : null;
        } catch (error) {
            logger.error('Error parsing user data:', error);
            return null;
        }
    }
    return null;
}

export function removeUser(): void {
    if (isBrowser()) {
        localStorage.removeItem(USER);
    }
}