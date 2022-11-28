import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";

export async function contributorRole(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  let allowContributor = null;

  if ((allowContributor = false)) {
    throw new Error();
  } else {
    done();
  }
}
