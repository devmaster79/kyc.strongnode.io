/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createLimit,
  LimitConfig,
  RequestWithLimit,
  resetTrials
} from './createLimit'
import { describe, it, before } from 'mocha'
import assert from 'assert'
import { Request, Response } from 'express'

describe('createLimit', () => {
  before(() => {
    resetTrials()
  })

  const snooze = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))
  const resWhileFree = {
    status(_code: number) {
      assert.ok(false, 'status sent while it should allow users')
    }
  } as unknown as Response
  const resWhileBanned = {
    status(_code: any) {
      return {
        send(_data: any) {
          assert.ok(true)
        }
      }
    }
  } as unknown as Response

  it('should allow 5 free trials by default', (done) => {
    const req = {} as unknown as RequestWithLimit<Request>
    const getIdentifier = (_req: unknown) => 'testuser1'
    const limit = createLimit('testLimit', getIdentifier)

    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      done()
    })
  })

  it('should allow 5 and ban after the 6th trial by default', (done) => {
    const req = {} as unknown as RequestWithLimit<Request>
    const getIdentifier = (_req: unknown) => 'testuser2'
    const resWhileBanned = {
      status(_code: number) {
        assert.ok(true)
        done()
      }
    } as unknown as Response
    const limit = createLimit('testLimit', getIdentifier)

    // allow 5 trials:
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    // 6th should be banned:
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban')
    })
  })

  it('should allow additional 5 free trial after 1 success', (done) => {
    const req: any = {}
    const getIdentifier = (_req: unknown) => 'testuser3'
    const resWhileBanned = {
      status(_code: unknown) {
        assert.ok(true)
        done()
      }
    } as unknown as Response
    const limit = createLimit('testLimit', getIdentifier)

    // allow 5 trials:
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.resolver(req, resWhileFree, () => {
      req.limits.testLimit.registerSuccess()
    })
    // allow 5 additional trials:
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    // 6th should be banned:
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban')
    })
  })

  it('should ban after max trials for the configured time', async () => {
    const req = {}
    const getIdentifier = (_req: any) => 'testuser4'
    const config: LimitConfig = {
      maxFreeTrials: 3,
      banMinutesBase: 0.1 / 60, // 100ms ban
      multiplier: 2,
      resetCountAfterBanExpires: false
    }
    const limit = createLimit('testLimit', getIdentifier, config)

    // allow 3 trials:
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })

    // trials for 90ms + wait until 110ms
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban')
    })
    await snooze(90)
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban')
    })
    await snooze(20)

    // allow 1 additional trials:
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })

    // trials for 190ms + wait for 210ms
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban')
    })
    await snooze(190)
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban')
    })
    await snooze(210)

    // allow 1 additional trials:
    limit.limiter(req, resWhileFree, () => {
      /* empty */
    })
  })

  it('should allow another max trials after ban', async () => {
    const req = {}
    const getIdentifier = (_req: any) => 'testuser5'
    const config: LimitConfig = {
      maxFreeTrials: 3,
      banMinutesBase: 0.1 / 60, // 100ms ban
      multiplier: 1,
      resetCountAfterBanExpires: true
    }
    const limit = createLimit('testLimit', getIdentifier, config)

    // allow 3 trials:
    for (let i = 0; i < 3; i++) {
      limit.limiter(req, resWhileFree, () => {
        /* empty */
      })
    }

    // trials for 90ms + wait until 110ms
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban1')
    })
    await snooze(90)
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban2')
    })
    await snooze(20)

    // allow 3 additional trials:
    for (let i = 0; i < 3; i++) {
      limit.limiter(req, resWhileFree, () => {
        /* empty */
      })
    }

    // trials for 90ms + wait for 20ms
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban3')
    })
    await snooze(90)
    limit.limiter(req, resWhileBanned, () => {
      assert.ok(false, 'next called while it should ban4')
    })
    await snooze(20)

    // allow 3 additional trials:
    for (let i = 0; i < 3; i++) {
      limit.limiter(req, resWhileFree, () => {
        /* empty */
      })
    }
  })
})
