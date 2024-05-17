import pino, { LoggerOptions } from 'pino';

const loggerOptions: LoggerOptions = {
  level: 'warn',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  base: {
    customAttribute: 'customValue',
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  formatters: {
    level(label: string): { level: string } {
      return { level: label };
    },
    bindings(bindings: { pid: number; hostname: string }): { pid: number; hostname: string } {
      return { pid: bindings.pid, hostname: bindings.hostname };
    },
  },
};

const logger = pino(loggerOptions);

export default logger;
