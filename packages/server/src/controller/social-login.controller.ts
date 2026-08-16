import { SocialLoginTypeEnum } from '@kyndform/shared-types-enums'
import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common'

import { helper } from '@kyndform/utils'
import { AuthService, RedisService, SocialLoginService } from '@service'
import { Logger } from '@utils'

const { isValid } = helper
const OAUTH_STATE_TTL = '10m'

@Controller()
export class SocialLoginController {
  private readonly logger: Logger

  constructor(
    private readonly socialLoginService: SocialLoginService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService
  ) {
    this.logger = new Logger(SocialLoginController.name)
  }

  /**
   * Sign With Apple will post the code to back server,
   * this value cannot be obtained in front end.
   * We have to use back end server to deal with the problem here,
   * and front end need to attach the browserId to the authorized url.
   *
   * Example:
   * http://my.kyndform.com/connect/google?state=DMbcJqLJ
   */
  @Get('/connect/:kind')
  async authUrl(
    @Param('kind') kind: string,
    @Query() query: Record<string, string>,
    @Req() req: any,
    @Res() res: any
  ) {
    if (helper.isEmpty(query.state)) {
      return res.render('index', {
        payload: {
          error: `unable_connect_${kind}`.toUpperCase()
        }
      })
    }

    const oauthState = await this.authService.createOAuthState(req, res, query.state)
    const authUrl = this.socialLoginService.authUrl(kind as any, oauthState)

    // Store redirect_uri to redis
    if (isValid(query.redirect_uri)) {
      const key = `redirect_uri:${oauthState}`

      await this.redisService.set({
        key,
        value: query.redirect_uri,
        duration: OAUTH_STATE_TTL
      })
    }

    if (helper.isEmpty(authUrl)) {
      return res.render('index', {
        data: {
          error: `unable_connect_${kind}`.toUpperCase()
        }
      })
    }

    res.redirect(302, authUrl)
  }

  @Get('/connect/:kind/callback')
  async authGetCallback(
    @Param('kind') kind: SocialLoginTypeEnum,
    @Query() query: Record<string, string>,
    @Req() req: any,
    @Res() res: any
  ) {
    await this.handleCallback(kind, query, req, res)
  }

  @Post('/connect/:kind/callback')
  async authPostCallback(
    @Param('kind') kind: SocialLoginTypeEnum,
    @Req() req: any,
    @Res() res: any
  ) {
    //!!! Sign With Apple will only post `code` and `state` to back-end server
    await this.handleCallback(kind, req.body, req, res)
  }

  private async handleCallback(
    kind: SocialLoginTypeEnum,
    query: Record<string, string>,
    req: any,
    res: any
  ) {
    try {
      await this.authService.verifyOAuthState(req, res, query.state)

      const userId = await this.socialLoginService.authCallback(
        kind,
        query.code || query.credential
      )

      await this.authService.login({
        res,
        userId,
        deviceId: this.authService.getDeviceId(req)
      })

      const baseUri = '/'

      const key = `redirect_uri:${query.state}`
      let redirectUri = await this.redisService.get(key)

      if (isValid(redirectUri)) {
        redirectUri = `${baseUri}?redirect_uri=${encodeURIComponent(redirectUri)}`
      } else {
        redirectUri = baseUri
      }

      res.render('social-login', {
        redirectUri
      })
    } catch (err) {
      this.logger.error(err)

      res.render('index', {
        data: {
          error: `unable_connect_${kind}`.toUpperCase()
        }
      })
    }
  }
}
