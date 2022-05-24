import '../utils/frontend-should-only-import-types-guard'
import { z } from 'zod'

export const userNameRule = z
  .string()
  .min(3, { message: 'Username should be at least 3 characters' })
  .regex(/^[a-z\-_]+$/g, {
    message:
      'Username should only contain lowercase letters including hypen (-) and underscore (_)'
  })
