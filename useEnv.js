import { useMemo } from "react";

/**
 * Hook personalizado para cargar y exponer variables de entorno de la aplicación (Vite).
 * Distingue automáticamente entre entornos de desarrollo (DEV) y producción.
 *
 * Los valores se cargan instantáneamente y se memoizan.
 *
 * @returns {object} Objeto con las variables de entorno cargadas.
 * @property {boolean} ENV_LOADED - Siempre `true`. Se mantiene por compatibilidad.
 * @property {string} BASENAME - El basename de la URL para el router (ej. /mi-app).
 * @property {string} BASE_URL - La URL base para las peticiones de API.
 * @property {string} URL_REDIRECT - URL de redirección utilizada por OAuth.
 * @property {string} URL_OAUTH - URL del proveedor de OAuth.
 * @property {string} CLIENTE_ID - ID de cliente para OAuth.
 * @property {boolean} TEST - Flag para habilitar/deshabilitar modos de prueba.
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