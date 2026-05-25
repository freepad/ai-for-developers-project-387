import type { Booking, BookingCreateInput, EventType, EventTypeCreateInput, EventTypeUpdateInput, Owner, Slot } from "../models.js";

export function decodeBase64(value: string): Uint8Array | undefined {
  if(!value) {
    return value as any;
  }
  // Normalize Base64URL to Base64
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    .padEnd(value.length + (4 - (value.length % 4)) % 4, '=');

  return new Uint8Array(Buffer.from(base64, 'base64'));
}export function encodeUint8Array(
  value: Uint8Array | undefined | null,
  encoding: BufferEncoding,
): string | undefined {
  if (!value) {
    return value as any;
  }
  return Buffer.from(value).toString(encoding);
}export function dateDeserializer(date?: string | null): Date {
  if (!date) {
    return date as any;
  }

  return new Date(date);
}export function dateRfc7231Deserializer(date?: string | null): Date {
  if (!date) {
    return date as any;
  }

  return new Date(date);
}export function dateRfc3339Serializer(date?: Date | null): string {
  if (!date) {
    return date as any
  }

  return date.toISOString();
}export function dateRfc7231Serializer(date?: Date | null): string {
  if (!date) {
    return date as any;
  }

  return date.toUTCString();
}export function dateUnixTimestampSerializer(date?: Date | null): number {
  if (!date) {
    return date as any;
  }

  return Math.floor(date.getTime() / 1000);
}export function dateUnixTimestampDeserializer(date?: number | null): Date {
  if (!date) {
    return date as any;
  }

  return new Date(date * 1000);
}export function createPayloadToTransport(payload: EventTypeCreateInput) {
  return jsonEventTypeCreateInputToTransportTransform(payload)!;
}export function updatePayloadToTransport(payload: EventTypeUpdateInput) {
  return jsonEventTypeUpdateInputToTransportTransform(payload)!;
}export function createPayloadToTransport_2(payload: BookingCreateInput) {
  return jsonBookingCreateInputToTransportTransform(payload)!;
}export function jsonArrayEventTypeToTransportTransform(
  items_?: Array<EventType> | null,
): any {
  if(!items_) {
    return items_ as any;
  }
  const _transformedArray = [];

  for (const item of items_ ?? []) {
    const transformedItem = jsonEventTypeToTransportTransform(item as any);
    _transformedArray.push(transformedItem);
  }

  return _transformedArray as any;
}export function jsonArrayEventTypeToApplicationTransform(
  items_?: any,
): Array<EventType> {
  if(!items_) {
    return items_ as any;
  }
  const _transformedArray = [];

  for (const item of items_ ?? []) {
    const transformedItem = jsonEventTypeToApplicationTransform(item as any);
    _transformedArray.push(transformedItem);
  }

  return _transformedArray as any;
}export function jsonEventTypeToTransportTransform(
  input_?: EventType | null,
): any {
  if(!input_) {
    return input_ as any;
  }
    return {
    id: input_.id,name: input_.name,description: input_.description,durationMinutes: input_.durationMinutes,ownerId: input_.ownerId
  }!;
}export function jsonEventTypeToApplicationTransform(input_?: any): EventType {
  if(!input_) {
    return input_ as any;
  }
    return {
    id: input_.id,name: input_.name,description: input_.description,durationMinutes: input_.durationMinutes,ownerId: input_.ownerId
  }!;
}export function jsonArraySlotToTransportTransform(
  items_?: Array<Slot> | null,
): any {
  if(!items_) {
    return items_ as any;
  }
  const _transformedArray = [];

  for (const item of items_ ?? []) {
    const transformedItem = jsonSlotToTransportTransform(item as any);
    _transformedArray.push(transformedItem);
  }

  return _transformedArray as any;
}export function jsonArraySlotToApplicationTransform(
  items_?: any,
): Array<Slot> {
  if(!items_) {
    return items_ as any;
  }
  const _transformedArray = [];

  for (const item of items_ ?? []) {
    const transformedItem = jsonSlotToApplicationTransform(item as any);
    _transformedArray.push(transformedItem);
  }

  return _transformedArray as any;
}export function jsonSlotToTransportTransform(input_?: Slot | null): any {
  if(!input_) {
    return input_ as any;
  }
    return {
    id: input_.id,eventTypeId: input_.eventTypeId,startAt: input_.startAt,endAt: input_.endAt,status: input_.status
  }!;
}export function jsonSlotToApplicationTransform(input_?: any): Slot {
  if(!input_) {
    return input_ as any;
  }
    return {
    id: input_.id,eventTypeId: input_.eventTypeId,startAt: input_.startAt,endAt: input_.endAt,status: input_.status
  }!;
}export function jsonBookingCreateInputToTransportTransform(
  input_?: BookingCreateInput | null,
): any {
  if(!input_) {
    return input_ as any;
  }
    return {
    eventTypeId: input_.eventTypeId,slotStart: input_.slotStart,slotEnd: input_.slotEnd,guestName: input_.guestName,guestContact: input_.guestContact
  }!;
}export function jsonBookingCreateInputToApplicationTransform(
  input_?: any,
): BookingCreateInput {
  if(!input_) {
    return input_ as any;
  }
    return {
    eventTypeId: input_.eventTypeId,slotStart: input_.slotStart,slotEnd: input_.slotEnd,guestName: input_.guestName,guestContact: input_.guestContact
  }!;
}export function jsonBookingToTransportTransform(input_?: Booking | null): any {
  if(!input_) {
    return input_ as any;
  }
    return {
    id: input_.id,eventTypeId: input_.eventTypeId,slotStart: input_.slotStart,slotEnd: input_.slotEnd,guestName: input_.guestName,guestContact: input_.guestContact,createdAt: input_.createdAt
  }!;
}export function jsonBookingToApplicationTransform(input_?: any): Booking {
  if(!input_) {
    return input_ as any;
  }
    return {
    id: input_.id,eventTypeId: input_.eventTypeId,slotStart: input_.slotStart,slotEnd: input_.slotEnd,guestName: input_.guestName,guestContact: input_.guestContact,createdAt: input_.createdAt
  }!;
}export function jsonArrayBookingToTransportTransform(
  items_?: Array<Booking> | null,
): any {
  if(!items_) {
    return items_ as any;
  }
  const _transformedArray = [];

  for (const item of items_ ?? []) {
    const transformedItem = jsonBookingToTransportTransform(item as any);
    _transformedArray.push(transformedItem);
  }

  return _transformedArray as any;
}export function jsonArrayBookingToApplicationTransform(
  items_?: any,
): Array<Booking> {
  if(!items_) {
    return items_ as any;
  }
  const _transformedArray = [];

  for (const item of items_ ?? []) {
    const transformedItem = jsonBookingToApplicationTransform(item as any);
    _transformedArray.push(transformedItem);
  }

  return _transformedArray as any;
}export function jsonOwnerToTransportTransform(input_?: Owner | null): any {
  if(!input_) {
    return input_ as any;
  }
    return {
    id: input_.id,name: input_.name,email: input_.email
  }!;
}export function jsonOwnerToApplicationTransform(input_?: any): Owner {
  if(!input_) {
    return input_ as any;
  }
    return {
    id: input_.id,name: input_.name,email: input_.email
  }!;
}export function jsonEventTypeCreateInputToTransportTransform(
  input_?: EventTypeCreateInput | null,
): any {
  if(!input_) {
    return input_ as any;
  }
    return {
    name: input_.name,description: input_.description,durationMinutes: input_.durationMinutes
  }!;
}export function jsonEventTypeCreateInputToApplicationTransform(
  input_?: any,
): EventTypeCreateInput {
  if(!input_) {
    return input_ as any;
  }
    return {
    name: input_.name,description: input_.description,durationMinutes: input_.durationMinutes
  }!;
}export function jsonEventTypeUpdateInputToTransportTransform(
  input_?: EventTypeUpdateInput | null,
): any {
  if(!input_) {
    return input_ as any;
  }
    return {
    name: input_.name,description: input_.description,durationMinutes: input_.durationMinutes
  }!;
}export function jsonEventTypeUpdateInputToApplicationTransform(
  input_?: any,
): EventTypeUpdateInput {
  if(!input_) {
    return input_ as any;
  }
    return {
    name: input_.name,description: input_.description,durationMinutes: input_.durationMinutes
  }!;
}
