import { BadRequestException } from '@nestjs/common'

import { Auth, FormGuard, Team } from '@decorator'
import { ConnectStripeInput, ConnectStripeType } from '@graphql'
import { helper } from '@kyndform/utils'
import { TeamModel } from '@model'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { FormService, PaymentService, RedisService } from '@service'

@Resolver()
@Auth()
export class ConnectStripeResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly formService: FormService,
    private readonly redisService: RedisService
  ) {}

  @Mutation(returns => ConnectStripeType)
  @FormGuard()
  async connectStripe(
    @Team() team: TeamModel,
    @Args('input') input: ConnectStripeInput
  ): Promise<ConnectStripeType> {
    if (!team.isOwner) {
      throw new BadRequestException(
        "You don't have permission to connect a Stripe account for this workspace"
      )
    }

    const key = `connect:stripe:${input.state}`
    const stateCache = await this.redisService.get(key)

    if (helper.isEmpty(stateCache)) {
      throw new BadRequestException('Authorization state expired')
    }

    if (stateCache !== input.formId) {
      throw new BadRequestException('Invalid authorization state')
    }

    const stripeAccount = await this.paymentService.getConnectAccount(input.code)

    await this.formService.update(input.formId, {
      stripeAccount
    })

    await this.redisService.del(key)

    return stripeAccount
  }
}
