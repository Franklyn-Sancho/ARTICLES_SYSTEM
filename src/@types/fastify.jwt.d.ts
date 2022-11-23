import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      admin: boolean;
      id: string;
      email: string;
    };
    contributor: {
      id: string;
    };
  }
}
