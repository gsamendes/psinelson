/**
 * Camada de simulação de rede. Centraliza o "delay" e o formato de erro
 * para que, no 8º período, cada service troque `delay(...)` por `fetch(...)`
 * sem mudar a assinatura consumida pelas telas.
 */

/** Erro de API simulado — mesma forma que um erro HTTP tratado teria. */
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Resolve após `ms`, devolvendo o valor — simula latência de rede. */
export function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
