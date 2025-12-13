import { TOKEN, USER } from '../utils/constants'
import { logger } from '../utils/logger'
import type { Usuario } from '../types'

export function setToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN, token)
    }
}

export function getToken(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN) || '';
    }
    return '';
}

export function removeToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN);
    }
}

export function setUser(user: Usuario | string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER, typeof user === 'string' ? user : JSON.stringify(user));
    }
}

export function getUser(): Usuario | null {
    if (typeof window !== 'undefined') {
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
    if (typeof window !== 'undefined') {
        localStorage.removeItem(USER);
    }
}