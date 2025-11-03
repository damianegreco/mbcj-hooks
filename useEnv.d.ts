/**
 * Hook personalizado para cargar y exponer variables de entorno de la aplicación (Vite).
 * Distingue automáticamente entre entornos de desarrollo (DEV) y producción.
 *
 * Los valores se cargan instantáneamente y se memoizan.
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
