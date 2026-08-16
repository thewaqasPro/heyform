import { UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'

import { SendResetPasswordEmailInput } from '@graphql'
import { DeviceIdGuard, GqlThrottlerGuard } from '@guard'
import { helper, hs } from '@kyndform/utils'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService, MailService, UserService } from '@service'

@Resolver()
@UseGuards(DeviceIdGuard)
export class SendResetPasswordEmailResolver {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Mutation(returns => Boolean)
  @UseGuards(GqlThrottlerGuard)
  @Throttle({
    default: {
      limit: 5,
      ttl: hs('1h')
    }
  })
  async sendResetPasswordEmail(
    @Args('input') input: SendResetPasswordEmailInput
  ): Promise<boolean> {
    const user = await this.userService.findByEmail(input.email)

    // Always return the same public result so this endpoint cannot be used to
    // enumerate registered email addresses.
    if (helper.isEmpty(user)) {
      return true
    }

    const key = `reset_password:${user.id}`
    const code = await this.authService.getVerificationCodeWithRateLimit(key)

    this.mailService.emailVerificationRequest(input.email, code, user.lang)
    return true
  }
}
