import { it, describe } from 'mocha'
import assert from 'assert'
import { ChecksumService } from './ChecksumService'

describe('Checksum service', () => {
  it('should give equal results for equal objects', () => {
    const service = new ChecksumService()
    const a = service.from({ some: { thing: 41 } })
    const b = service.from({ some: { thing: 41 } })
    assert.equal(a, b)
  })
  it('should give different results for different objects', () => {
    const service = new ChecksumService()
    const a = service.from({ some: { thing: 41 } })
    const b = service.from({ some: { thing: 2 } })
    assert.notEqual(a, b)
  })
  it('should be able to verify checksums for same objects', () => {
    const service = new ChecksumService()
    const checksum = service.from({ some: { thing: 41 } })
    const result = service.verify({ some: { thing: 41 } }, checksum)
    assert.ok(result)
  })
  it('should be able to verify checksums for different objects', () => {
    const service = new ChecksumService()
    const checksum = service.from({ some: { thing: 41 } })
    const result = service.verify({ some: { thing: 2 } }, checksum)
    assert.ok(!result)
  })
})
