/**
 * Hook personalizado para gestionar la autenticación y los datos del usuario.
 * Proporciona estado (logged, usuario, persona, token) y métodos (login, logout, checkLogged)
 * para interactuar con el estado de autenticación y localStorage.
 *
 * @returns {{
 * logged: boolean|null;
 * usuario: object|null;
 * persona: object|null;
 * tipoUsuarioId: string|null;
 * token: string|null;
 * checkLogged: (tiposUsuariosId?: Array<number>) => boolean;
 * login: (token: string, usuario: object) => void;
 * logout: () => void;
 * getLocalData: () => string|null;
 * verificarToken: () => boolean;
 * }} Objeto con el estado y las funciones de autenticación.
 */
export default function useUser(): {
    logged: boolean | null;
    usuario: object | null;
    persona: object | null;
    tipoUsuarioId: string | null;
    token: string | null;
    checkLogged: (tiposUsuariosId?: Array<number>) => boolean;
    login: (token: string, usuario: object) => void;
    logout: () => void;
    getLocalData: () => string | null;
    verificarToken: () => boolean;
};
