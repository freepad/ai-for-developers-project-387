import { parse } from "uri-template";
import type { EventTypesClientContext } from "./eventTypesClientContext.js";
import { createRestError } from "../../helpers/error.js";
import type { OperationOptions } from "../../helpers/interfaces.js";
import { jsonArrayEventTypeToApplicationTransform, jsonEventTypeToApplicationTransform } from "../../models/internal/serializers.js";
import type { EventType } from "../../models/models.js";

export interface ListOptions extends OperationOptions {}
export async function list(
  client: EventTypesClientContext,
  options?: ListOptions,
): Promise<Array<EventType>> {
  const path = parse("/api/event-types").expand({});
  const httpRequestOptions = {
    headers: {},
  };
  const response = await client.pathUnchecked(path).get(httpRequestOptions);


  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }
  if (+response.status === 200 && response.headers["content-type"]?.includes("application/json")) {
    return jsonArrayEventTypeToApplicationTransform(response.body)!;
  }
  throw createRestError(response);
}
;
export interface ReadOptions extends OperationOptions {}
export async function read(
  client: EventTypesClientContext,
  id: string,
  options?: ReadOptions,
): Promise<EventType | void> {
  const path = parse("/api/event-types/{id}").expand({
    id: id
  });
  const httpRequestOptions = {
    headers: {},
  };
  const response = await client.pathUnchecked(path).get(httpRequestOptions);


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
