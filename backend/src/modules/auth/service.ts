import { prisma } from '../../shared/prisma/prismaClient';
import { AppError } from '../../shared/errors/AppError';
import { comparePassword, hashPassword } from '../../shared/utils/password';
import { signAccessToken, signRefreshToken, verifyToken } from '../../shared/utils/jwt';
import type { LoginInput, RegisterInput } from './schemas';

/**
 * Regras de autenticação (esqueleto). Stateless: emite access + refresh JWT.
 * Senhas sempre via bcrypt — nunca em texto puro.
 */
export const authService = {
  async register(input: RegisterInput) {
    const exists = await prisma.user.findFirst({
      where: { email: input.email, tenantId: input.tenantId },
    });
    if (exists) {
      throw new AppError(409, 'E-mail já cadastrado neste tenant.');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
      },
      select: { id: true, name: true, email: true, role: true, tenantId: true },
    });

    return user;
  },

  async me(tenantId: string, userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
      select: { id: true, name: true, email: true, role: true, tenantId: true },
    });
    if (!user) throw new AppError(404, 'Usuário não encontrado.');
    return user;
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findFirst({ where: { email: input.email } });
    if (!user) {
      throw new AppError(401, 'Credenciais inválidas.');
    }

    const ok = await comparePassword(input.password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, 'Credenciais inválidas.');
    }

    const payload = { sub: user.id, role: user.role, tenantId: user.tenantId };
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  },

  /**
   * Renova os tokens a partir de um refresh token válido. Stateless: re-emite
   * sem store de sessão. (Revogação/rotação persistida fica para evolução.)
   */
  refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch {
      throw new AppError(401, 'Refresh token inválido ou expirado.');
    }
    const next = { sub: payload.sub, role: payload.role, tenantId: payload.tenantId };
    return {
      accessToken: signAccessToken(next),
      refreshToken: signRefreshToken(next),
    };
  },
};
