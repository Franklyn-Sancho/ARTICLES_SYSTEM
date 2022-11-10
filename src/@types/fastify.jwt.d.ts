import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      author: string;
      email: string;
    };
  }
}
