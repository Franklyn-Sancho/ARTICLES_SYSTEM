import { FastifyReply, FastifyRequest } from "fastify";

export function hasRole(roles) {
  return function (request: FastifyRequest, reply: FastifyReply) {
    if (!request.user.admin || !roles.includes(request.user.admin)) {
      return reply.status(403).send("Access denied");
    }
  };
}
