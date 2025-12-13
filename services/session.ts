import { TOKEN, USER } from '../utils/constants'
import { logger } from '../utils/logger'

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

export function setUser(user: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USER, user);
    }
}

export function getUser(): string | null {
    if (typeof window !== 'undefined') {
        try {
            const user = localStorage.getItem(USER);
            return user ? JSON.parse(user) : null;
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