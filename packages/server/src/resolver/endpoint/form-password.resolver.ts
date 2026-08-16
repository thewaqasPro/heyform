import {
  BadRequestException,
  Headers,
  InternalServerErrorException,
  UseGuards
} from '@nestjs/common'

import { BCRYPT_SALT, FORM_ENCRYPTION_KEY } from '@environments'
import { VerifyPasswordInput } from '@graphql'
import { EndpointAnonymousIdGuard } from '@guard'
import { timestamp } from '@kyndform/utils'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { FormService } from '@service'
import { aesEncryptObject, comparePassword, isPasswordHash, passwordHash } from '@utils'

@Resolver()
@UseGuards(EndpointAnonymousIdGuard)
export class FormPasswordResolver {
  constructor(private readonly formService: FormService) {}

  @Query(returns => String)
  async verifyFormPassword(
    @Headers('x-anonymous-id') anonymousId: string,
    @Args('input') input: VerifyPasswordInput
  ): Promise<string> {
    const form = await this.formService.findById(input.formId)

    if (!form) {
      throw new BadRequestException('The form does not exist')
    }

    if (form.suspended) {
      throw new BadRequestException('The form is suspended')
    }

    if (form.settings.active !== true) {
      throw new BadRequestException('The form does not active')
    }

    const storedPassword = form.settings.password

    if (!form.settings.requirePassword || !storedPassword) {
      throw new BadRequestException('The password does not match')
    }

    const matches = isPasswordHash(storedPassword)
      ? await comparePassword(input.password, storedPassword)
      : input.password === storedPassword

    if (!matches) {
      throw new BadRequestException('The password does not match')
    }

    let currentPasswordHash = storedPassword!

    // Transparently migrate existing plaintext form passwords after the owner deploys this fix.
    if (!isPasswordHash(storedPassword)) {
      currentPasswordHash = await passwordHash(input.password, BCRYPT_SALT)
      const updated = await this.formService.migrateLegacyPassword(
        form.id,
        storedPassword,
        currentPasswordHash
      )

      if (!updated) {
        throw new InternalServerErrorException('Failed to secure the form password')
      }
    }

    return aesEncryptObject(
      {
        timestamp: timestamp(),
        formId: form.id,
        anonymousId,
        passwordHash: currentPasswordHash
      },
      FORM_ENCRYPTION_KEY
    )
  }
}
