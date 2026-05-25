import { parse } from "uri-template";
import type { OwnerOpsClientContext } from "./ownerOpsClientContext.js";
import { createRestError } from "../../helpers/error.js";
import type { OperationOptions } from "../../helpers/interfaces.js";
import { jsonOwnerToApplicationTransform } from "../../models/internal/serializers.js";
import type { Owner } from "../../models/models.js";

export interface GetOptions extends OperationOptions {}
export async function get(
  client: OwnerOpsClientContext,
  options?: GetOptions,
): Promise<Owner> {
  const path = parse("/api/owner").expand({});
  const httpRequestOptions = {
    headers: {},
  };
  const response = await client.pathUnchecked(path).get(httpRequestOptions);


  if (typeof options?.operationOptions?.onResponse === "function") {
    options?.operationOptions?.onResponse(response);
  }
  if (+response.status === 200 && response.headers["content-type"]?.includes("application/json")) {
    return jsonOwnerToApplicationTransform(response.body)!;
  }
  throw createRestError(response);
}
;
