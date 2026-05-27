import type { operations } from "../types/api.js";
import type { FastifyRequest, FastifyReply } from "fastify";

type Handler = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<unknown>;

export const handlers: Record<string, Handler> = {
  EventTypes_list: async (request, _reply) => {
    const eventTypes = await request.server.prisma.eventType.findMany();
    return eventTypes.map(formatEventType);
  },

  EventTypes_read: async (request, reply) => {
    const { id } = request.params as { id: string };
    const eventType = await request.server.prisma.eventType.findUnique({
      where: { id },
    });

    if (!eventType) {
      reply.code(404);
      return { code: 404, message: "EventType not found" };
    }

    return formatEventType(eventType);
  },

  Slots_list: async (request, _reply) => {
    const { eventTypeId, from, to } = request.params as {
      eventTypeId: string;
    } & { from?: string; to?: string };

    const where: Record<string, unknown> = { eventTypeId };
    if (from || to) {
      const startAt: Record<string, unknown> = {};
      if (from) startAt.gte = new Date(from);
      if (to) startAt.lte = new Date(to);
      where.startAt = startAt;
    }

    const slots = await request.server.prisma.slot.findMany({ where });
    return slots.map(formatSlot);
  },

  Bookings_list: async (request, _reply) => {
    const bookings = await request.server.prisma.booking.findMany();
    return bookings.map(formatBooking);
  },

  Bookings_create: async (request, reply) => {
    const { eventTypeId, slotStart, slotEnd, guestName, guestContact } =
      request.body as operations["Bookings_create"]["requestBody"]["content"]["application/json"];

    const eventType = await request.server.prisma.eventType.findUnique({
      where: { id: eventTypeId },
    });
    if (!eventType) {
      reply.code(409);
      return { code: 409, message: "EventType not found" };
    }

    const start = new Date(slotStart);
    const end = new Date(slotEnd);

    const conflicting = await request.server.prisma.booking.findFirst({
      where: {
        eventTypeId,
        slotStart: { lt: end },
        slotEnd: { gt: start },
      },
    });

    if (conflicting) {
      reply.code(409);
      return { code: 409, message: "Time slot is already booked" };
    }

    const booking = await request.server.prisma.booking.create({
      data: {
        eventTypeId,
        slotStart: start,
        slotEnd: end,
        guestName,
        guestContact,
      },
    });

    await request.server.prisma.slot.updateMany({
      where: {
        eventTypeId,
        status: "free",
        startAt: { gte: start },
        endAt: { lte: end },
      },
      data: { status: "booked" },
    });

    return formatBooking(booking);
  },

  OwnerOps_get: async (request, _reply) => {
    const owner = await request.server.prisma.owner.findFirst();
    if (!owner) {
      return { id: "", name: "" };
    }
    return formatOwner(owner);
  },

  AdminEventTypes_create: async (request, _reply) => {
    const { name, description, durationMinutes } =
      request.body as operations["AdminEventTypes_create"]["requestBody"]["content"]["application/json"];

    const owner = await request.server.prisma.owner.findFirst();
    if (!owner) {
      throw new Error("No owner found");
    }

    const eventType = await request.server.prisma.eventType.create({
      data: {
        name,
        description,
        durationMinutes,
        ownerId: owner.id,
      },
    });

    return formatEventType(eventType);
  },

  AdminEventTypes_update: async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = request.body as operations["AdminEventTypes_update"]["requestBody"]["content"]["application/json"];

    const existing = await request.server.prisma.eventType.findUnique({
      where: { id },
    });
    if (!existing) {
      reply.code(404);
      return { code: 404, message: "EventType not found" };
    }

    const eventType = await request.server.prisma.eventType.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        durationMinutes: data.durationMinutes,
      },
    });

    return formatEventType(eventType);
  },

  AdminSlots_generate: async (request, reply) => {
    const { eventTypeId } = request.params as { eventTypeId: string };
    const { from, to, slotDurationMinutes } =
      request.body as operations["AdminSlots_generate"]["requestBody"]["content"]["application/json"];

    const eventType = await request.server.prisma.eventType.findUnique({
      where: { id: eventTypeId },
    });
    if (!eventType) {
      reply.code(404);
      return { code: 404, message: "EventType not found" };
    }

    const duration = slotDurationMinutes ?? eventType.durationMinutes;
    const startDate = new Date(from);
    const endDate = new Date(to);

    const slotsToCreate: { startAt: Date; endAt: Date }[] = [];
    const current = new Date(startDate);
    current.setHours(9, 0, 0, 0);

    const endOfDay = new Date(current);
    endOfDay.setHours(18, 0, 0, 0);

    while (current < endDate) {
      const slotEnd = new Date(current.getTime() + duration * 60 * 1000);
      if (slotEnd <= endOfDay) {
        slotsToCreate.push({
          startAt: new Date(current),
          endAt: slotEnd,
        });
        current.setTime(current.getTime() + duration * 60 * 1000);
      } else {
        current.setDate(current.getDate() + 1);
        current.setHours(9, 0, 0, 0);
        endOfDay.setDate(current.getDate());
        endOfDay.setHours(18, 0, 0, 0);
      }
    }

    for (const slot of slotsToCreate) {
      await request.server.prisma.slot.upsert({
        where: {
          eventTypeId_startAt_endAt: {
            eventTypeId,
            startAt: slot.startAt,
            endAt: slot.endAt,
          },
        },
        update: {},
        create: {
          id: crypto.randomUUID(),
          eventTypeId,
          startAt: slot.startAt,
          endAt: slot.endAt,
          status: "free",
        },
      });
    }

    const slots = await request.server.prisma.slot.findMany({
      where: {
        eventTypeId,
        startAt: { gte: startDate },
        endAt: { lte: endDate },
      },
      orderBy: { startAt: "asc" },
    });

    return slots.map(formatSlot);
  },
};

function formatEventType(et: {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: et.id,
    name: et.name,
    description: et.description ?? undefined,
    durationMinutes: et.durationMinutes,
    ownerId: et.ownerId,
  };
}

function formatSlot(s: {
  id: string;
  eventTypeId: string;
  startAt: Date;
  endAt: Date;
  status: string;
}) {
  return {
    id: s.id,
    eventTypeId: s.eventTypeId,
    startAt: s.startAt.toISOString(),
    endAt: s.endAt.toISOString(),
    status: s.status as "free" | "booked",
  };
}

function formatBooking(b: {
  id: string;
  eventTypeId: string;
  slotStart: Date;
  slotEnd: Date;
  guestName: string | null;
  guestContact: string | null;
  createdAt: Date;
}) {
  return {
    id: b.id,
    eventTypeId: b.eventTypeId,
    slotStart: b.slotStart.toISOString(),
    slotEnd: b.slotEnd.toISOString(),
    guestName: b.guestName ?? undefined,
    guestContact: b.guestContact ?? undefined,
    createdAt: b.createdAt.toISOString(),
  };
}

function formatOwner(o: { id: string; name: string; email: string | null }) {
  return {
    id: o.id,
    name: o.name,
    email: o.email ?? undefined,
  };
}