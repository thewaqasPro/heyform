import { BadRequestException, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'

import { Auth, Team, TeamGuard, User } from '@decorator'
import { APP_HOMEPAGE_URL } from '@environments'
import { InviteMemberInput } from '@graphql'
import { GqlThrottlerGuard } from '@guard'
import { helper } from '@kyndform/utils'
import { ms } from '@kyndform/utils'
import { TeamModel, UserModel } from '@model'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { MailService, RedisService, TeamService, UserService } from '@service'
import { normalizeInvitationRecipients } from '@utils'

const INVITATION_RECIPIENT_HOURLY_LIMIT = 100

@Resolver()
@Auth()
@UseGuards(GqlThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: ms('1h') } })
export class InviteMemberResolver {
  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService
  ) {}

  @Mutation(returns => Boolean)
  @TeamGuard()
  async inviteMember(
    @Team() team: TeamModel,
    @User() user: UserModel,
    @Args('input') input: InviteMemberInput
  ): Promise<boolean> {
    if (!team.isOwner) {
      throw new BadRequestException("You don't have permission to invite member")
    }

    let exists: string[] = []
    const members = await this.teamService.findMembersInTeam(input.teamId)

    if (helper.isValid(members)) {
      exists = (await this.userService.findAll(members.map(member => member.memberId))).map(
        row => row.email
      )
    }

    const emails = normalizeInvitationRecipients(input.emails, exists)

    if (emails.length < 1) {
      return true
    }

    await this.redisService.throttler(
      `invite-member:user:${user.id}`,
      INVITATION_RECIPIENT_HOURLY_LIMIT,
      '1h',
      emails.length
    )
    await this.redisService.throttler(
      `invite-member:team:${team.id}`,
      INVITATION_RECIPIENT_HOURLY_LIMIT,
      '1h',
      emails.length
    )

    await Promise.all(
      emails.map(email =>
        this.mailService.teamInvitation(
          email,
          {
            userName: user.name,
            teamName: team.name,
            link: `${APP_HOMEPAGE_URL}/workspace/${team.id}/invitation/${team.inviteCode}`
          },
          user.lang
        )
      )
    )

    return true
  }
}
