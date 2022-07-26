/* eslint-disable no-console */
export class Logger {
  constructor(private moduleName: string) {}
  /** It logs the message only when NODE_ENV === 'development' */
  devLog(...messages: unknown[]) {
    if (process.env.NODE_ENV === 'development') {
      this.log(messages)
    }
  }
  log(...messages: unknown[]) {
    console.log(this.prefix, ...messages)
  }
  info(...messages: unknown[]) {
    console.info(this.prefix, ...messages)
  }
  warn(...messages: unknown[]) {
    console.warn(this.prefix + '\x1b[33m', ...messages, '\x1b[0m')
  }
  error(...messages: unknown[]) {
    console.error(this.prefix, ...messages)
  }
  debug(...messages: unknown[]) {
    this.devLog(...messages)
  }

  private get prefix() {
    return `@[${this.moduleName}]:`
  }
}

export const AppLogger = new Logger('App')
