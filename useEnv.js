import { useMemo } from "react";

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
export default function useEnv() {
  const env = import.meta.env;

  const envVars = useMemo(() => {
    return {
      BASENAME: env.VITE_BASENAME,
      BASE_URL: env.VITE_BASE_URL,
      URL_REDIRECT: env.VITE_URL_REDIRECT,
      URL_OAUTH: env.VITE_URL_OAUTH,
      CLIENTE_ID: env.VITE_CLIENTE_ID,
      TEST: (env.VITE_TEST || "").toLowerCase() === "true",
    };
  }, [env]);

  return {
    ...envVars,
    ENV_LOADED: true,
  };
}