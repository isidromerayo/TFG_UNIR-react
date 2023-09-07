import { TOKEN, USER } from '../utils'

export function setToken(token: string): void {
    localStorage.setItem(TOKEN, token)
}
export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN);
    }
    return ''
}
export function removeToken(): void {
    localStorage.removeItem(TOKEN);
}

export function setUser(user: string): void {
    localStorage.setItem(USER, user)
}
export function getUser(): any | null {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem(USER));
    }
    return ''
}
export function removeUser(): void {
    localStorage.removeItem(USER);
}