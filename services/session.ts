import { TOKEN, USER } from '../utils'

export function setToken(token: string): void {
    sessionStorage.setItem(TOKEN, token)
}
export function getToken(): string {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(TOKEN);
    }
    return undefined
}
export function removeToken(): void {
    sessionStorage.removeItem(TOKEN);
}

export function setUser(user: string): void {
    sessionStorage.setItem(USER, user)
}
export function getUser(): string {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(USER);
    }
    return undefined
}
export function removeUser(): void {
    sessionStorage.removeItem(USER);
}