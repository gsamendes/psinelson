/**
 * Configuração de runtime do frontend.
 *
 * Por padrão o app usa **dados simulados** (mocks), garantindo que as telas
 * funcionem sem backend. Para apontar para a API real, defina no `.env`:
 *
 *   VITE_USE_MOCKS=false
 *   VITE_API_URL=http://localhost:3333/api
 *
 * Cada service decide, via `USE_MOCKS`, se executa o caminho mock ou HTTP.
 */
const useMocksEnv = import.meta.env.VITE_USE_MOCKS;

/** true = mocks (default). Só usa API real quando VITE_USE_MOCKS === 'false'. */
export const USE_MOCKS = useMocksEnv === undefined ? true : useMocksEnv !== 'false';

/** Base URL da API real. */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';
