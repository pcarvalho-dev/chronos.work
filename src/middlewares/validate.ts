import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodObject<any, any>, target: 'body' | 'query' = 'body') => (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = target === 'query' ? req.query : req.body;
    schema.parse(data);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.issues,
      });
    }
    next(error);
  }
};
