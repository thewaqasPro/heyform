import { Logger as L } from '@nestjs/common'

export class Logger extends L {
  static info(message: any, ...optionalParams: any[]): void {
    L.log(message, ...optionalParams)
  }

  static trace(message: any, ...optionalParams: any[]): void {
    L.error(message, ...optionalParams)
  }

  static fatal(message: any, ...optionalParams: any[]): void {
    L.error(message, ...optionalParams)
  }

  info(message: any, ...optionalParams: any[]): void {
    this.log(message, ...optionalParams)
  }

  trace(message: any, ...optionalParams: any[]): void {
    this.error(message, ...optionalParams)
  }

  fatal(message: any, ...optionalParams: any[]): void {
    this.error(message, ...optionalParams)
  }
}
