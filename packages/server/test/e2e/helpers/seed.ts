import mongoose from 'mongoose'

/**
 * Direct mongo writes used to bootstrap state the server has no public API
 * for. Right now that's just "join this user to the team with a specific
 * role" — the role mutation referenced by the webapp isn't wired up on the
 * server, so seeding is the only way to test MEMBER role permissions.
 */

interface ConnectOpts {
  mongoUri?: string
}

function resolveUri(opts: ConnectOpts): string {
  return (
    opts.mongoUri ??
    process.env.E2E_MONGO_URI ??
    process.env.MONGO_URI ??
    'mongodb://127.0.0.1:27017/kyndform'
  )
}

export interface SeedTeamMemberInput {
  teamId: string
  memberId: string
  /** 0=OWNER, 1=ADMIN, 2=COLLABORATOR, 3=MEMBER */
  role: number
}

export async function seedTeamMember(input: SeedTeamMemberInput, opts: ConnectOpts = {}) {
  const connection = await mongoose.createConnection(resolveUri(opts)).asPromise()
  try {
    await connection.collection('teammembermodels').updateOne(
      { teamId: input.teamId, memberId: input.memberId },
      {
        $set: { teamId: input.teamId, memberId: input.memberId, role: input.role, lastSeenAt: 0 }
      },
      { upsert: true }
    )
  } finally {
    await connection.close()
  }
}

export async function seedProjectMember(
  input: { projectId: string; memberId: string },
  opts: ConnectOpts = {}
) {
  const connection = await mongoose.createConnection(resolveUri(opts)).asPromise()
  try {
    await connection
      .collection('projectmembermodels')
      .updateOne(
        { projectId: input.projectId, memberId: input.memberId },
        { $set: { projectId: input.projectId, memberId: input.memberId } },
        { upsert: true }
      )
  } finally {
    await connection.close()
  }
}
