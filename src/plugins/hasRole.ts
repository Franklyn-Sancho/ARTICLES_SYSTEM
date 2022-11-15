import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

export function hasRole(roles) {
  return function (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
    if (!request.user.admin || !roles.includes(request.user.admin)) {
      return reply.status(403).send("Acesso negado");
    }

    done();
  };
}
