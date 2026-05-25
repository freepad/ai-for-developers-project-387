import { parse } from "uri-template";
import type { SlotsClientContext } from "./slotsClientContext.js";
import { createRestError } from "../../helpers/error.js";
import type { OperationOptions } from "../../helpers/interfaces.js";
import { jsonArraySlotToApplicationTransform } from "../../models/internal/serializers.js";
import type { Slot } from "../../models/models.js";

export interface ListOptions extends OperationOptions {
  from?: string
  to?: string
}
export async function list(
  client: SlotsClientContext,
  eventTypeId: string,
  options?: ListOptions,
): Promise<Array<Slot>> {
  const path = parse("/api/event-types/{eventTypeId}/slots{?from,to}").expand({
    eventTypeId: eventTypeId,
    ...(options?.from && {from: options.from}),
    ...(options?.to && {to: options.to})
  });
  const httpRequestOptions = {
    headers: {},
  };
  const response = await client.pathUnchecked(path).get(httpRequestOptions);


  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }
  if (+response.status === 200 && response.headers["content-type"]?.includes("application/json")) {
    return jsonArraySlotToApplicationTransform(response.body)!;
  }
  throw createRestError(response);
}
;
