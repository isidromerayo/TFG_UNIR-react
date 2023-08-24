import { TOKEN, USER } from '../utils'

export function setToken(token: string): void {
    localStorage.setItem(TOKEN, token)
}
export function getToken(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN);
    }
    return undefined
}
export function removeToken(): void {
    localStorage.removeItem(TOKEN);
}

export function setUser(user: string): void {
    localStorage.setItem(USER, user)
}
export function getUser(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(USER);
    }
    return undefined
}
export function removeUser(): void {
    localStorage.removeItem(USER);
}