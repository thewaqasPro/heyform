import { BadRequestException, UseGuards } from '@nestjs/common'

import { BCRYPT_SALT } from '@environments'
import { ResetPasswordInput } from '@graphql'
import { DeviceIdGuard } from '@guard'
import { helper } from '@kyndform/utils'
import { UserLangEnum } from '@model'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService, MailService, UserService } from '@service'
import { GqlLang, passwordHash } from '@utils'

@Resolver()
@UseGuards(DeviceIdGuard)
export class ResetPasswordResolver {
  constructor(
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Mutation(returns => Boolean)
  async resetPassword(
    @GqlLang() lang: UserLangEnum,
    @Args('input') input: ResetPasswordInput
  ): Promise<boolean> {
    const user = await this.userService.findByEmail(input.email)

    if (helper.isEmpty(user)) {
      throw new BadRequestException('Invalid verification code')
    }

    const key = `limit:reset_password:${user.id}`

    await this.authService.attemptsCheck(key, async () => {
      const codeKey = `reset_password:${user.id}`
      await this.authService.checkVerificationCode(codeKey, input.code)
    })
    await this.authService.clearAttempts(key)

    await this.userService.update(user.id, {
      password: await passwordHash(input.password, BCRYPT_SALT)
    })

    await this.authService.invalidateSessions(user.id)
    this.mailService.passwordChangeAlert(user.email, lang)

    return true
  }
}
