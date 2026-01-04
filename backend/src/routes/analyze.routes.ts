import { FastifyInstance } from 'fastify';
import { analyzeDocument, analyzeSchema } from '../controllers/analyze.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyToken } from '../utils/jwt';

export default async function analyzeRoutes(app: FastifyInstance) {
    // Auth Middleware
    app.addHook('preHandler', async (req, reply) => {
        // Skip auth for public routes if any (none here)
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({ error: 'Missing Authorization header' });
        }
        try {
            const token = authHeader.replace('Bearer ', '');
            const payload = verifyToken(token);
            (req as any).user = payload;
        } catch (e) {
            return reply.code(401).send({ error: 'Invalid Token' });
        }
    });

    app.withTypeProvider<ZodTypeProvider>().post(
        '/analyze',
        { schema: { body: analyzeSchema } },
        analyzeDocument
    );
}
