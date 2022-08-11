import crypto from 'crypto'

export class ChecksumService {
  constructor(private __crypto: typeof crypto = crypto) {}

  from(value: unknown): string {
    const json = JSON.stringify(value)
    return this.__crypto.createHash('sha1').update(json).digest('hex')
  }

  verify(value: unknown, checksum: string): boolean {
    return this.from(value) === checksum
  }
}
