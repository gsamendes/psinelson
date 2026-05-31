/** Erro de aplicação com status HTTP. Capturado pelo errorHandler global. */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/** Atalho para "não implementado nesta fase do esqueleto". */
export class NotImplementedError extends AppError {
  constructor(message = 'Recurso ainda não implementado nesta fase do MVP.') {
    super(501, message);
    this.name = 'NotImplementedError';
  }
}
