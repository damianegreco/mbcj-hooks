import { useState, useCallback, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import useEnv from "./useEnv.js";

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
export default function useUser() {
  const [usuario, setUsuario] = useState(null);
  const [persona, setPersona] = useState(null);
  const [tipoUsuarioId, setTipoUsuarioId] = useState(null);
  const [logged, setLogged] = useState(null); // 'null' indica "aún no verificado"
  const [token, setToken] = useState(null);
  const { BASENAME, TEST } = useEnv();

  // --- Funciones Helper Internas (Memoizadas) ---

  /**
   * Obtiene los datos completos del usuario desde localStorage.
   * @returns {object|null} Los datos del usuario parseados o null si no existen o hay error.
   */
  const getUsuarioFromStorage = () => {
    const usuarioData = localStorage.getItem(`${BASENAME}_datos`);
    if (!usuarioData) return null;
    
    try {
      return JSON.parse(usuarioData);
    } catch (error) {
      console.error("Error parseando datos de usuario desde localStorage:", error);
      localStorage.clear();
      return null;
    }
  };

  /**
   * Actualiza los estados 'usuario' y 'persona' a partir de datos proporcionados
   * o leyéndolos desde localStorage. Separa 'persona' del objeto 'usuario'.
   * @param {object|null} [usuarioParam=null] - Datos de usuario opcionales para establecer el estado. Si es null, usa getUsuarioFromStorage.
   */
  const getUser = (usuarioParam = null) => {
    const datos = usuarioParam ? usuarioParam : getUsuarioFromStorage();
    if (datos) {
      const personaData = datos.persona;
      const usuarioState = { ...datos };
      delete usuarioState.persona;
      
      setPersona(personaData);
      setUsuario(usuarioState);
    } else {
      setPersona(null);
      setUsuario(null);
    }
  }; // setPersona y setUsuario son estables

  /**
   * Actualiza el estado 'tipoUsuarioId' desde un parámetro o localStorage.
   * @param {string|null} [tipo_usuario_id=null] - ID de tipo de usuario opcional.
   * @returns {string|null} El ID del tipo de usuario encontrado.
   */
  const getTipoUsuario = (tipo_usuario_id = null) => {
    const tipoUsuarioIdLocal = tipo_usuario_id ? tipo_usuario_id : localStorage.getItem(`${BASENAME}_tipo_usuario_id`);
    setTipoUsuarioId(tipoUsuarioIdLocal);
    return tipoUsuarioIdLocal;
  }; // setTipoUsuarioId es estable

  // --- Funciones Públicas (Memoizadas) ---

  /**
   * Limpia localStorage y resetea todos los estados de autenticación.
   */
  const logout = () => {
    localStorage.clear();
    setPersona(null);
    setUsuario(null);
    setTipoUsuarioId(null);
    setToken(null);
    setLogged(false);
  }; // Todos los setters de useState son estables

  /**
   * Procesa el inicio de sesión: decodifica el token, guarda en localStorage
   * y actualiza el estado global del hook.
   * @param {string} token - El token JWT recibido.
   * @param {object} usuario - Los datos del usuario (fallback si el token no los incluye).
   */
  const login = (token, usuario) => {
    if (typeof usuario !== 'object' || usuario === null) {
      console.error("Intento de login con datos de usuario inválidos:", usuario);
      return;
    }
    
    try {
      const decoded = jwtDecode(token);
      const tipoUsuarioId = decoded.data.tipo_usuario_id;
      const usuarioData = decoded.data || usuario;

      // Guardar en localStorage
      localStorage.setItem(`${BASENAME}_token`, token);
      localStorage.setItem(`${BASENAME}_tipo_usuario_id`, tipoUsuarioId);
      localStorage.setItem(`${BASENAME}_datos`, JSON.stringify(usuarioData));

      // Actualizar estado
      setToken(token);
      setLogged(true);
      getUser(usuarioData); // 'usuarioData' contiene la info completa
      getTipoUsuario(tipoUsuarioId);

    } catch (error) {
      console.error("Error al decodificar el token en login:", error);
      logout(); // Si el token es inválido, limpiamos todo
    }
  };

  /**
   * Carga los datos de autenticación desde localStorage al estado del hook.
   * Se usa típicamente en la inicialización de la app.
   * Asegura que el estado se establezca de forma consistente (usando getUser/getTipoUsuario).
   * @returns {string|null} El token si se encontraron todos los datos, o null si faltaba algo.
   */
  const getLocalData = () => {
    const token = localStorage.getItem(`${BASENAME}_token`);
    const tipoUsuarioId = localStorage.getItem(`${BASENAME}_tipo_usuario_id`);
    const usuarioData = getUsuarioFromStorage(); // Solo obtiene los datos

    if (token && tipoUsuarioId && usuarioData) {
      getUser(usuarioData); // Usa el helper para settear 'usuario' y 'persona'
      getTipoUsuario(tipoUsuarioId); // Usa el helper para settear 'tipoUsuarioId'
      setToken(token);
      setLogged(true);
      return token;
    }
    
    // Limpia el estado si falta algún dato
    setUsuario(null);
    setPersona(null);
    setTipoUsuarioId(null);
    setToken(null);
    setLogged(false);
    return null;
  };

  /**
   * Verifica si el token (actualmente en estado) es válido y no ha expirado.
   * @returns {boolean} True si el token es válido y no expirado, false en caso contrario.
   */
  const verificarToken = () => {
    // Si 'logged' es null (estado inicial), no podemos verificar
    if (logged === null || !token) return false; 
    
    try {
      const decoded = jwtDecode(token);
      const exp = new Date(decoded.exp * 1000);
      const today = new Date();
      
      return exp >= today; // True si no ha expirado

    } catch (error) {
      console.error("Error al verificar token:", error);
      return false; // Token inválido o corrupto
    }
  };

  /**
   * Verifica si el usuario está logueado y, opcionalmente, si su tipo de usuario
   * coincide con alguno de los IDs proporcionados.
   * En modo TEST, siempre devuelve true.
   * @param {Array<number>} [tiposUsuariosId=[]] - Lista de IDs de tipo de usuario permitidos.
   * @returns {boolean} True si está logueado (y el tipo coincide, si se especifica), false si no.
   */
  const checkLogged = (tiposUsuariosId = []) => {
    if (TEST) return true;

    // Lee el token directamente de localStorage para la comprobación más rápida
    const token = localStorage.getItem(`${BASENAME}_token`);
    if (!token) {
      logout();
      return false;
    }

    // Usa la función de estado para verificar la expiración
    if (verificarToken()) {
      const currentTipoUsuarioId = localStorage.getItem(`${BASENAME}_tipo_usuario_id`);
      if (tiposUsuariosId.length > 0) {
        return tiposUsuariosId.includes(parseInt(currentTipoUsuarioId, 10));
      }
      return true; // Logueado y no se requiere tipo específico
    }
    
    console.error("Token vencido o inválido");
    logout();
    return false;
  };

  // // --- Efecto de Inicialización ---
  // // Carga los datos del localStorage *una sola vez* al montar el hook.
  // useEffect(() => {
  //   getLocalData();
  // }, []); // getLocalData está memoizada, por lo que esto solo se ejecuta una vez

  // --- Retorno del Hook ---
  return { 
    logged, 
    usuario, 
    persona, 
    tipoUsuarioId, 
    token, 
    checkLogged, 
    login, 
    logout, 
    getLocalData, 
    verificarToken 
  };
}