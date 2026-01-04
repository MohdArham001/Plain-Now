import 'dotenv/config';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

const app = fastify({ logger: true });

// Register Plugins
app.register(helmet, { global: true });
app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
});
app.register(cors, {
    origin: true, // Reflect request origin (better than * for credentialed reqs)
});

// Zod Validation Setup
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Register Routes
app.register(import('./routes/auth.routes'), { prefix: '/auth' });
app.register(import('./routes/analyze.routes'), { prefix: '/api' });


// Health Check
app.get('/', async () => {
    return { status: 'ok', message: 'PlainNow API is running' };
});

const start = async () => {
    try {
        const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`DB URL: ${process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@')}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
