import { z } from 'zod';
import { insertMemorySchema, insertQuizSchema, insertSecretSchema, insertSettingsSchema, memories, quizzes, secrets, settings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  settings: {
    get: {
      method: 'GET' as const,
      path: '/api/settings' as const,
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/settings' as const,
      input: insertSettingsSchema,
      responses: {
        200: z.custom<typeof settings.$inferSelect>(),
      },
    },
  },
  memories: {
    list: {
      method: 'GET' as const,
      path: '/api/memories' as const,
      responses: {
        200: z.array(z.custom<typeof memories.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/memories' as const,
      input: insertMemorySchema,
      responses: {
        201: z.custom<typeof memories.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/memories/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  quizzes: {
    list: {
      method: 'GET' as const,
      path: '/api/quizzes' as const,
      responses: {
        200: z.array(z.custom<typeof quizzes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/quizzes' as const,
      input: insertQuizSchema,
      responses: {
        201: z.custom<typeof quizzes.$inferSelect>(),
      },
    },
    solve: {
      method: 'POST' as const,
      path: '/api/quizzes/:id/solve' as const,
      input: z.object({ answer: z.string() }),
      responses: {
        200: z.object({ correct: z.boolean(), message: z.string().optional() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/quizzes/:id' as const,
      responses: {
        204: z.void(),
      },
    },
  },
  secrets: {
    list: {
      method: 'GET' as const,
      path: '/api/secrets' as const,
      responses: {
        200: z.array(z.custom<typeof secrets.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/secrets' as const,
      input: insertSecretSchema,
      responses: {
        201: z.custom<typeof secrets.$inferSelect>(),
      },
    },
    unlock: {
      method: 'POST' as const,
      path: '/api/secrets/unlock' as const,
      input: z.object({ code: z.string() }),
      responses: {
        200: z.object({ success: z.boolean(), secret: z.custom<typeof secrets.$inferSelect>().optional() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/secrets/:id' as const,
      responses: {
        204: z.void(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
