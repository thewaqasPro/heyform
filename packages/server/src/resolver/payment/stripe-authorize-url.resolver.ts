import { BadRequestException } from '@nestjs/common'

import { Auth, FormGuard, Team, User } from '@decorator'
import { FormDetailInput } from '@graphql'
import { nanoid } from '@kyndform/utils'
import { TeamModel, UserModel } from '@model'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PaymentService, RedisService } from '@service'

@Resolver()
@Auth()
export class StripeAuthorizeUrlResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly redisService: RedisService
  ) {}

  @Query(returns => String)
  @FormGuard()
  async stripeAuthorizeUrl(
    @User() user: UserModel,
    @Team() team: TeamModel,
    @Args('input') input: FormDetailInput
  ): Promise<string> {
    if (!team.isOwner) {
      throw new BadRequestException(
        "You don't have permission to connect a Stripe account for this workspace"
      )
    }

    const state = nanoid()
    const key = `connect:stripe:${state}`

    await this.redisService.set({
      key,
      value: input.formId,
      duration: '1h'
    })

    return this.paymentService.getAuthorizeUrl(state, user.email)
  }
}
