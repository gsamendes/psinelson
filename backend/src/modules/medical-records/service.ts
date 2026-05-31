import { NotImplementedError } from '../../shared/errors/AppError';

/**
 * Prontuário — NÃO implementado nesta fase (esqueleto).
 * Acesso a dados clínicos exige, antes de qualquer leitura/escrita:
 *  - JWT + RBAC;
 *  - tenant_id correto;
 *  - vínculo terapêutico ATIVO entre o psicólogo e o paciente;
 *  - registro de auditoria.
 * Por segurança, as operações lançam 501 até esses controles existirem.
 */
export const medicalRecordsService = {
  list() {
    throw new NotImplementedError(
      'Prontuário não disponível: requer RBAC, vínculo terapêutico ativo e auditoria.'
    );
  },

  get() {
    throw new NotImplementedError(
      'Prontuário não disponível: requer RBAC, vínculo terapêutico ativo e auditoria.'
    );
  },
};
