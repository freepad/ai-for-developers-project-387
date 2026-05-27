import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.owner.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Алексей Смирнов",
      email: "alexey@example.com",
    },
  });

  const consultation = await prisma.eventType.upsert({
    where: { id: "550e8400-e29b-41d4-a716-446655440000" },
    update: {},
    create: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Консультация",
      description: "Индивидуальная консультация",
      durationMinutes: 30,
      ownerId: owner.id,
    },
  });

  const intro = await prisma.eventType.upsert({
    where: { id: "550e8400-e29b-41d4-a716-446655440001" },
    update: {},
    create: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Знакомство",
      description: "Вводная встреча 15 минут",
      durationMinutes: 15,
      ownerId: owner.id,
    },
  });

  await prisma.slot.upsert({
    where: {
      eventTypeId_startAt_endAt: {
        eventTypeId: consultation.id,
        startAt: new Date("2025-06-01T10:00:00Z"),
        endAt: new Date("2025-06-01T10:30:00Z"),
      },
    },
    update: {},
    create: {
      id: "660e8400-e29b-41d4-a716-446655440001",
      eventTypeId: consultation.id,
      startAt: new Date("2025-06-01T10:00:00Z"),
      endAt: new Date("2025-06-01T10:30:00Z"),
      status: "free",
    },
  });

  await prisma.slot.upsert({
    where: {
      eventTypeId_startAt_endAt: {
        eventTypeId: consultation.id,
        startAt: new Date("2025-06-01T11:00:00Z"),
        endAt: new Date("2025-06-01T11:30:00Z"),
      },
    },
    update: {},
    create: {
      id: "660e8400-e29b-41d4-a716-446655440002",
      eventTypeId: consultation.id,
      startAt: new Date("2025-06-01T11:00:00Z"),
      endAt: new Date("2025-06-01T11:30:00Z"),
      status: "free",
    },
  });

  await prisma.slot.upsert({
    where: {
      eventTypeId_startAt_endAt: {
        eventTypeId: intro.id,
        startAt: new Date("2025-06-01T09:00:00Z"),
        endAt: new Date("2025-06-01T09:15:00Z"),
      },
    },
    update: {},
    create: {
      id: "660e8400-e29b-41d4-a716-446655440003",
      eventTypeId: intro.id,
      startAt: new Date("2025-06-01T09:00:00Z"),
      endAt: new Date("2025-06-01T09:15:00Z"),
      status: "free",
    },
  });

  console.log("Seed data created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });