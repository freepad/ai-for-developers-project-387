import { parse } from "uri-template";
import type { BookingsClientContext } from "./bookingsClientContext.js";
import { createRestError } from "../../helpers/error.js";
import type { OperationOptions } from "../../helpers/interfaces.js";
import { jsonArrayBookingToApplicationTransform, jsonBookingCreateInputToTransportTransform, jsonBookingToApplicationTransform } from "../../models/internal/serializers.js";
import type { Booking, BookingCreateInput } from "../../models/models.js";

export interface CreateOptions extends OperationOptions {}
export async function create(
  client: BookingsClientContext,
  input: BookingCreateInput,
  options?: CreateOptions,
): Promise<Booking | void> {
  const path = parse("/api/bookings").expand({});
  const httpRequestOptions = {
    headers: {},body: jsonBookingCreateInputToTransportTransform(input),
  };
  const response = await client.pathUnchecked(path).post(httpRequestOptions);


  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }
  if (+response.status === 200 && response.headers["content-type"]?.includes("application/json")) {
    return jsonBookingToApplicationTransform(response.body)!;
  }
  if (+response.status === 409 && !response.body) {
    return;
  }
  throw createRestError(response);
}
;
export interface ListOptions extends OperationOptions {}
export async function list(
  client: BookingsClientContext,
  options?: ListOptions,
): Promise<Array<Booking>> {
  const path = parse("/api/bookings").expand({});
  const httpRequestOptions = {
    headers: {},
  };
  const response = await client.pathUnchecked(path).get(httpRequestOptions);


  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }
  if (+response.status === 200 && response.headers["content-type"]?.includes("application/json")) {
    return jsonArrayBookingToApplicationTransform(response.body)!;
  }
  throw createRestError(response);
}
;
