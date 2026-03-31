/**
 * Hook personalizado para cargar y exponer variables de entorno de la aplicación.
 * Los valores se inyectan dinámicamente según el entorno (desarrollo, testing o producción)
 * y se memoizan para optimizar su lectura en los componentes.
 *
 * @returns {{
 * ENV_LOADED: boolean;
 * BASENAME: string;
 * BASE_URL: string;
 * URL_REDIRECT: string;
 * URL_OAUTH: string;
 * CLIENTE_ID: string;
 * TEST: boolean;
 * }} Objeto con las variables de entorno cargadas.
 */
export default function useEnv(): {
    ENV_LOADED: boolean;
    BASENAME: string;
    BASE_URL: string;
    URL_REDIRECT: string;
    URL_OAUTH: string;
    CLIENTE_ID: string;
    TEST: boolean;
};
