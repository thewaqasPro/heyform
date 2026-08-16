import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException
} from '@nestjs/common'

import { helper } from '@kyndform/utils'
import { GqlContextType } from '@nestjs/graphql'
import { Logger } from '@utils'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: Error, host: ArgumentsHost): any {
    this.logger.error(exception, (exception as any).stack)

    const status = exception instanceof HttpException ? exception.getStatus() : 500
    const httpException =
      exception instanceof HttpException && status >= 400 && status < 500
        ? exception
        : new InternalServerErrorException('Internal server error')

    if (host.getType<GqlContextType>() === 'graphql') {
      return httpException
    }

    const res = host.switchToHttp().getResponse()

    if (res.get('content-type') === 'text/event-stream') {
      const response = httpException.getResponse()
      let message = response as string

      if (helper.isObject(response)) {
        const responseMessage = (response as any).message
        message = helper.isArray(responseMessage) ? responseMessage[0] : responseMessage
      }

      res.sse(`data: [ERROR] ${message}\n\n`)
      return res.end()
    }

    if (!res.headersSent) {
      res.status(httpException.getStatus()).json(httpException.getResponse())
    }
  }
}
