import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'

import { COOKIE_DEVICE_ID_NAME } from '@config'
import { helper } from '@kyndform/utils'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class DeviceIdGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    let { req } = ctx.getContext()

    if (helper.isEmpty(req)) {
      req = context.switchToHttp().getRequest()
    }

    const deviceId = req.get('x-device-id') || req.cookies[COOKIE_DEVICE_ID_NAME]

    if (helper.isEmpty(deviceId)) {
      throw new ForbiddenException('Forbidden request error')
    }

    return true
  }
}
