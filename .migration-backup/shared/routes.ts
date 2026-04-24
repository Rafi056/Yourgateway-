import { z } from 'zod';
import { insertApplicationSchema, applications, institutions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  institutions: {
    list: {
      method: 'GET' as const,
      path: '/api/institutions' as const,
      input: z.object({
        type: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof institutions.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/institutions/:id' as const,
      responses: {
        200: z.custom<typeof institutions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  applications: {
    create: {
      method: 'POST' as const,
      path: '/api/applications' as const,
      input: insertApplicationSchema,
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/applications' as const,
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/applications/:id' as const,
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  }
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
