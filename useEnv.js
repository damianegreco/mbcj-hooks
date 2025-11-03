import { useMemo } from "react";

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
export default function useEnv() {
  const env = import.meta.env;

  // useMemo calcula este objeto solo una vez y lo "memoriza".
  // Es la forma correcta de devolver un valor constante desde un hook.
  const envVars = useMemo(() => {
    if (env.DEV) {
      return {
        BASENAME: env.VITE_BASENAME_DEV,
        BASE_URL: env.VITE_BASE_URL_DEV,
        URL_REDIRECT: env.VITE_URL_REDIRECT_DEV,
        URL_OAUTH: env.VITE_URL_OAUTH_DEV,
        CLIENTE_ID: env.VITE_CLIENTE_ID_DEV,
        TEST: (env.VITE_TEST_DEV || "").toLowerCase() === "true",
      };
    } else {
      return {
        BASENAME: env.VITE_BASENAME,
        BASE_URL: env.VITE_BASE_URL,
        URL_REDIRECT: env.VITE_URL_REDIRECT,
        URL_OAUTH: env.VITE_URL_OAUTH,
        CLIENTE_ID: env.VITE_CLIENTE_ID,
        TEST: (env.VITE_TEST || "").toLowerCase() === "true",
      };
    }
  }, [env]); // 'env' es estático, por lo que esto solo se ejecuta una vez.

  return {
    ...envVars,
    // Los datos se cargan instantáneamente.
    // Mantenemos ENV_LOADED en 'true' solo por compatibilidad
    // con el código que ya lo esté usando.
    ENV_LOADED: true,
  };
}