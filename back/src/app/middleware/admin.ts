import { UserRequest } from 'app/controllers/utils'
import { UserLevel } from 'app/models/user.model'
import { NextFunction, Response } from 'express'

const adminOnly = (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.user.level !== UserLevel.Admin) {
    return res.status(401).send({ result: 'unauthorized-error' })
  }
  return next()
}

export default adminOnly
