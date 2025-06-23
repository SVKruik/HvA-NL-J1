import Fastify, { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import dotenv from "dotenv";
import { log } from './utils/logger';
import { readFileSync, writeFileSync } from 'fs';
dotenv.config();
const fastify = Fastify();

// Keep in-memory for performance.
const keys = JSON.parse(readFileSync(process.env.REST_DATA_LOCATION as string, "utf-8"));

/**
 * Check if the request is authorized.
 * @param request The incoming request.
 * @param reply The downstream reply.
 * @param done Send the request downstream.
 * @returns Reply on unauthorized or void for downstream.
 */
function isAuthorized(request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction): FastifyReply | void {
    // Imagine using auth in 2025 (joking, disabled for demo purposes)
    return done();
}

// Logging
fastify.addHook("preHandler", (request: FastifyRequest, _reply: FastifyReply, done: HookHandlerDoneFunction) => {
    log(`API Request || Agent: ${request.headers["user-agent"]} || ${request.method} ${request.url}`, "info");
    done();
});

// Read Key
fastify.get("/r/:target", (request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    const params = request.params as { target: string, hash: string | undefined };
    const key: string | undefined = keys[params.target];
    if (key) {
        return reply.send(key);
    } else return reply.status(404).send("Key not found.");
});

// Read All Keys
fastify.get("/r", { preHandler: isAuthorized }, (_request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    return reply.send(keys);
});

// New Key
fastify.post("/w", { preHandler: isAuthorized }, (request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    // Validation
    const payload = request.body as { name: string, value: string };
    if (!payload.name || !payload.value || !payload.value.length || !payload.value.length) return reply.status(400).send("Invalid payload provided.");
    if (keys[payload.name]) return reply.status(409).send("Key already exists.");

    // Write
    keys[payload.name] = payload.value;
    writeFileSync(process.env.REST_DATA_LOCATION as string, JSON.stringify(keys, null, 4), {
        "encoding": "utf-8",
        "flag": "w"
    });
    return reply.send();
});

// Delete Key
fastify.delete("/d/:target", { preHandler: isAuthorized }, (request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    // Validation
    const target = request.params as { target: string };
    if (!keys[target.target]) return reply.status(404).send("Key not found.");

    // Write
    delete keys[target.target];
    writeFileSync(process.env.REST_DATA_LOCATION as string, JSON.stringify(keys, null, 4), {
        "encoding": "utf-8",
        "flag": "w"
    });
    return reply.send();
});

// Catch All
fastify.get("*", (_request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    return reply.send("HvA SSRF Keystore API");
});
fastify.post("*", (_request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    return reply.send("HvA SSRF Keystore API");
});
fastify.delete("*", (_request: FastifyRequest, reply: FastifyReply): FastifyReply => {
    return reply.send("HvA SSRF Keystore API");
});

// Start
fastify.listen({ port: parseInt(process.env.REST_PORT as string) })
    .then(() => {
        log(`HvA SSRF Keystore API server listening on port ${process.env.REST_PORT}`, "info");
    }).catch((error) => {
        fastify.log.error(error);
        process.exit(1);
    });