#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Bring up the dockerised stack defined in docker-compose.test.yml,
 * wait for the server to be ready, run the e2e suite, then tear down
 * (unless the user asked us to keep it).
 *
 *  Env:
 *   E2E_KEEP_UP=1     leave the stack running after tests finish
 *   E2E_BASE_URL      override the server URL (default: http://localhost:9157)
 *   E2E_WAIT_MS       how long to wait for /health/ready (default: 120000)
 */

const { spawnSync } = require('child_process')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..')
const COMPOSE_FILE = path.join(REPO_ROOT, 'docker-compose.test.yml')

function run(cmd, args, opts = {}) {
  console.log(`$ ${cmd} ${args.join(' ')}`)
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    cwd: REPO_ROOT,
    env: process.env,
    ...opts
  })
  if (result.error) throw result.error
  return result.status === null ? 1 : result.status
}

function compose(args) {
  return run('docker', ['compose', '-f', COMPOSE_FILE, ...args])
}

async function main() {
  let code = 0
  try {
    code = compose(['up', '-d', '--build', 'kyndform'])
    if (code !== 0) {
      console.error('Failed to bring up the docker stack')
      process.exit(code)
    }

    const env = {
      ...process.env,
      E2E_BASE_URL: process.env.E2E_BASE_URL || 'http://localhost:9157',
      E2E_MONGO_URI: process.env.E2E_MONGO_URI || 'mongodb://127.0.0.1:27017/kyndform',
      E2E_REDIS_HOST: process.env.E2E_REDIS_HOST || '127.0.0.1',
      E2E_REDIS_PORT: process.env.E2E_REDIS_PORT || '9514',
      E2E_WAIT_MS: process.env.E2E_WAIT_MS || '120000'
    }

    code = run('pnpm', ['--filter', './packages/server', 'run', 'test:e2e'], {
      env
    })
  } catch (err) {
    console.error(err)
    code = 1
  } finally {
    if (process.env.E2E_KEEP_UP === '1') {
      console.log('\nE2E_KEEP_UP=1 — leaving stack running. Tear down with:')
      console.log(`  docker compose -f ${COMPOSE_FILE} down -v`)
    } else {
      compose(['down', '-v'])
    }
  }
  process.exit(code)
}

main()
