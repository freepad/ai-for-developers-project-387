import fp from "fastify-plugin";
import { request as httpRequest } from "node:http";

export default fp(
  async (fastify) => {
    const ssrPort = Number(process.env.SSR_PORT) || 3001;

    fastify.setNotFoundHandler((request, reply) => {
      const proxyReq = httpRequest(
        {
          hostname: "127.0.0.1",
          port: ssrPort,
          path: request.url,
          method: request.method,
          headers: { ...request.headers },
        },
        (proxyRes) => {
          reply.code(proxyRes.statusCode ?? 200);
          for (const [key, value] of Object.entries(proxyRes.headers)) {
            if (value != null) {
              reply.header(key, value);
            }
          }
          proxyRes.pipe(reply.raw);
        }
      );

      proxyReq.on("error", () => {
        if (!reply.sent) {
          reply.code(502).send("Bad Gateway");
        }
      });

      if (request.raw.readableEnded) {
        if (request.body && Object.keys(request.body).length > 0) {
          const bodyStr =
            typeof request.body === "string"
              ? request.body
              : JSON.stringify(request.body);
          proxyReq.setHeader("content-length", Buffer.byteLength(bodyStr));
          proxyReq.end(bodyStr);
        } else {
          proxyReq.end();
        }
      } else {
        request.raw.pipe(proxyReq);
      }
    });
  },
  { name: "ssr-proxy" }
);
