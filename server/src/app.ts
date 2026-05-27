import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import openapiGlue from "fastify-openapi-glue";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";

import prismaPlugin from "./plugins/prisma.js";
import { handlers } from "./routes/handlers.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function buildApp() {
  const app = Fastify({ logger: true });

  const specPath = resolve(__dirname, "../../schema/openapi.yaml");
  const specContent = YAML.parse(readFileSync(specPath, "utf-8"));

  await app.register(cors, { origin: true });

  await app.register(swagger, {
    openapi: specContent,
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "list" },
  });

  await app.register(prismaPlugin);

  await app.register(openapiGlue, {
    specification: specContent,
    serviceHandlers: handlers,
  });

  return app;
}