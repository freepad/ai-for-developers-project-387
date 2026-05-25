import { parse } from "uri-template";
import type { AdminEventTypesClientContext } from "./adminEventTypesClientContext.js";
import { createRestError } from "../../helpers/error.js";
import type { OperationOptions } from "../../helpers/interfaces.js";
import { jsonEventTypeCreateInputToTransportTransform, jsonEventTypeToApplicationTransform, jsonEventTypeUpdateInputToTransportTransform } from "../../models/internal/serializers.js";
import type { EventType, EventTypeCreateInput, EventTypeUpdateInput } from "../../models/models.js";

export interface CreateOptions extends OperationOptions {}
export async function create(
  client: AdminEventTypesClientContext,
  input: EventTypeCreateInput,
  options?: CreateOptions,
): Promise<EventType | void> {
  const path = parse("/api/admin/event-types").expand({});
  const httpRequestOptions = {
    headers: {},body: jsonEventTypeCreateInputToTransportTransform(input),
  };
  const response = await client.pathUnchecked(path).post(httpRequestOptions);


  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }
  if (+response.status === 200 && response.headers["content-type"]?.includes("application/json")) {
    return jsonEventTypeToApplicationTransform(response.body)!;
  }
  if (+response.status === 201 && !response.body) {
    return;
  }
  throw createRestError(response);
}
;
export interface UpdateOptions extends OperationOptions {}
export async function update(
  client: AdminEventTypesClientContext,
  id: string,
  input: EventTypeUpdateInput,
  options?: UpdateOptions,
): Promise<EventType | void> {
  const path = parse("/api/admin/event-types/{id}").expand({
    id: id
  });
  const httpRequestOptions = {
    headers: {},body: jsonEventTypeUpdateInputToTransportTransform(input),
  };
  const response = await client.pathUnchecked(path).patch(httpRequestOptions);


  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }
  if (+response.status === 200 && response.headers["content-type"]?.includes("application/json")) {
    return jsonEventTypeToApplicationTransform(response.body)!;
  }
  if (+response.status === 404 && !response.body) {
    return;
  }
  throw createRestError(response);
}
;
