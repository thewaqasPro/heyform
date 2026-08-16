import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRedis } from '@svtslv/nestjs-ioredis'
import { randomUUID } from 'crypto'
import { Redis } from 'ioredis'

import { hs } from '@kyndform/utils'

interface BaseOptions {
  key: string
}

interface SetOptions extends BaseOptions {
  value: any
  duration: string
}

interface HsetOptions extends SetOptions {
  field: string
}

interface HgetOptions extends BaseOptions {
  field?: string
}

interface HdelOptions extends BaseOptions {
  field?: string | string[]
}

const RATE_LIMIT_SCRIPT = `
local count = redis.call('INCRBY', KEYS[1], ARGV[2])
if count == tonumber(ARGV[2]) then
  redis.call('EXPIRE', KEYS[1], ARGV[1])
end
return {count, redis.call('TTL', KEYS[1])}
`

const RELEASE_LOCK_SCRIPT = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0
`

const EXTEND_LOCK_SCRIPT = `
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('EXPIRE', KEYS[1], ARGV[2])
end
return 0
`

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  public async getInt(key: string, defaultValue = 0): Promise<number> {
    const result = await this.get(key)

    return parseInt(result, defaultValue)
  }

  public async incrementWithExpiry(key: string, ttl: string, amount = 1): Promise<number> {
    const duration = hs(ttl)

    if (!duration || !Number.isSafeInteger(amount) || amount < 1) {
      throw new Error(`Invalid rate limit duration: ${ttl}`)
    }

    const [count] = (await this.redis.eval(RATE_LIMIT_SCRIPT, 1, key, duration, amount)) as [
      number,
      number
    ]

    return count
  }

  public async throttler(key: string, limit: number, ttl: string, amount = 1) {
    const duration = hs(ttl)

    if (!duration || !Number.isSafeInteger(amount) || amount < 1) {
      throw new Error(`Invalid rate limit options for duration: ${ttl}`)
    }

    const [count, timeLeft] = (await this.redis.eval(
      RATE_LIMIT_SCRIPT,
      1,
      key,
      duration,
      amount
    )) as [number, number]

    if (count > limit) {
      throw new HttpException(
        `Too many requests. Please try again in ${Math.max(timeLeft, 0)} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS
      )
    }
  }

  public async withLock<T>(
    key: string,
    ttl: string,
    callback: () => Promise<T>,
    retries = 40,
    retryDelayMs = 50
  ): Promise<T> {
    const duration = hs(ttl)

    if (!duration) {
      throw new Error(`Invalid lock duration: ${ttl}`)
    }

    const token = randomUUID()
    let acquired = false

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      acquired = (await this.redis.set(key, token, 'EX', duration, 'NX')) === 'OK'

      if (acquired) {
        break
      }

      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelayMs))
      }
    }

    if (!acquired) {
      throw new HttpException(
        'The requested resource is busy. Please try again.',
        HttpStatus.TOO_MANY_REQUESTS
      )
    }

    const renewalIntervalMs = Math.max(100, Math.floor((duration * 1_000) / 3))
    let renewalPromise = Promise.resolve()
    let stopped = false
    const renewalTimer = setInterval(() => {
      renewalPromise = renewalPromise
        .then(async () => {
          if (!stopped) {
            await this.redis.eval(EXTEND_LOCK_SCRIPT, 1, key, token, duration)
          }
        })
        // A transient renewal error must not become an unhandled rejection. The owned-release
        // script below still prevents this holder from deleting a newer holder's lock.
        .catch(() => undefined)
    }, renewalIntervalMs)
    renewalTimer.unref?.()

    try {
      return await callback()
    } finally {
      stopped = true
      clearInterval(renewalTimer)
      await renewalPromise
      await this.redis.eval(RELEASE_LOCK_SCRIPT, 1, key, token)
    }
  }

  public set({ key, value, duration }: SetOptions): Promise<any> {
    return this.redis.set(key, value, 'ex', hs(duration))
  }

  public hset({ key, field, value, duration }: HsetOptions): Promise<[Error | null, any][]> {
    return this.multi([
      ['hset', key, field, value],
      ['expire', key, hs(duration)]
    ])
  }

  public hsetObject({ key, value: obj, duration }: SetOptions): Promise<[Error | null, any][]> {
    return this.multi([
      ...Object.keys(obj).map(field => ['hset', key, field, obj[field]]),
      ['expire', key, hs(duration)]
    ])
  }

  public hget({
    key,
    field
  }: HgetOptions): Promise<string | null> | Promise<Record<string, string>> {
    if (field) {
      return this.redis.hget(key, field)
    }
    return this.redis.hgetall(key)
  }

  public hdel({ key, field }: HdelOptions): Promise<number> {
    if (field) {
      return this.redis.hdel(key, field as KeyType)
    }
    return this.del(key)
  }

  /**
   * Atomically read and remove a hash field. This uses Lua for compatibility
   * with Redis versions that do not provide HGETDEL.
   */
  public hgetdel({ key, field }: Required<HgetOptions>): Promise<string | null> {
    return this.redis.eval(
      "local value = redis.call('HGET', KEYS[1], ARGV[1]); if value then redis.call('HDEL', KEYS[1], ARGV[1]); end; return value",
      1,
      key,
      field
    ) as Promise<string | null>
  }

  public multi(commands: any[][]): Promise<[Error | null, any][]> {
    return this.redis.multi(commands).exec()
  }

  public incr(key: string): Promise<number> {
    return this.redis.incr(key)
  }

  public del(key: string): Promise<number> {
    return this.redis.del(key)
  }

  public ping(): Promise<'PONG'> {
    return this.redis.ping() as Promise<'PONG'>
  }
}
