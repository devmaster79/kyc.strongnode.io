import { z } from 'zod'

export const userNameRule = z
  .string()
  .min(3, { message: 'Username should be at least 3 characters' })
  .regex(/^[a-z0-9\-_]+$/g, {
    message:
      'Username should only contain lowercase letters, numbers, hypen (-) and underscore (_)'
  })
