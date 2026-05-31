import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Seed inicial (idempotente) para desenvolvimento/demonstração.
 * Cria um tenant demo, uma psicóloga, uma paciente e disponibilidades.
 * Senha de todos: "123456" (apenas demonstração — não usar em produção).
 */
async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: { name: 'Clínica Demo', slug: 'demo' },
  });

  const passwordHash = await bcrypt.hash('123456', 10);

  // Psicóloga + perfil
  const psyUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'ana.costa@email.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Dra. Ana Costa',
      email: 'ana.costa@email.com',
      passwordHash,
      role: 'PSYCHOLOGIST',
    },
  });
  const psyProfile = await prisma.psychologistProfile.upsert({
    where: { userId: psyUser.id },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: psyUser.id,
      crp: 'CRP 06/123456',
      specialty: 'Ansiedade',
      approach: 'Terapia Cognitivo-Comportamental',
      bio: 'Atendimento focado em ansiedade e estresse (dados de demonstração).',
    },
  });

  // Paciente + perfil
  const patUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'camila.souza@email.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Camila Souza',
      email: 'camila.souza@email.com',
      passwordHash,
      role: 'PATIENT',
    },
  });
  await prisma.patientProfile.upsert({
    where: { userId: patUser.id },
    update: {},
    create: { tenantId: tenant.id, userId: patUser.id },
  });

  // Disponibilidades (recria de forma idempotente)
  await prisma.availability.deleteMany({
    where: { tenantId: tenant.id, psychologistId: psyProfile.id },
  });
  await prisma.availability.createMany({
    data: [
      { tenantId: tenant.id, psychologistId: psyProfile.id, date: new Date('2026-06-01'), time: '14:00', modality: 'ONLINE' },
      { tenantId: tenant.id, psychologistId: psyProfile.id, date: new Date('2026-06-03'), time: '09:00', modality: 'PRESENCIAL' },
      { tenantId: tenant.id, psychologistId: psyProfile.id, date: new Date('2026-06-05'), time: '17:00', modality: 'ONLINE' },
    ],
  });

  console.log('Seed concluído.');
  console.log(`Tenant: ${tenant.slug} (${tenant.id})`);
  console.log('Logins demo (senha 123456): ana.costa@email.com (psicóloga), camila.souza@email.com (paciente)');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
