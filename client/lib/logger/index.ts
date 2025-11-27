import pino from 'pino';

const isServer = typeof window === 'undefined';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  browser: {
    asObject: true
  },
  ...(isServer && {
    transport: {
      targets: [
        {
          target: 'pino-loki',
          options: {
            batching: true,
            interval: 5,
            host: process.env.LOKI_URL || 'http://localhost:3100',
            labels: { app: 'nextjs-client' }
          },
          level: 'info'
        },
        {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname'
          },
          level: 'info'
        }
      ]
    }
  })
});
