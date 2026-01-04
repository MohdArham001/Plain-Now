import { FastifyInstance } from 'fastify';
import { registerUser, loginUser, registerSchema, loginSchema } from '../controllers/auth.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function authRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
        '/register',
        { schema: { body: registerSchema } },
        registerUser
    );

    app.withTypeProvider<ZodTypeProvider>().post(
        '/login',
        { schema: { body: loginSchema } },
        loginUser
    );
}
