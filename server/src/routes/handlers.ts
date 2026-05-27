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