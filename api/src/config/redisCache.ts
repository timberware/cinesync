import KeyvRedis from '@keyv/redis';
import Keyv from 'keyv';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const RedisOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const redisHost = configService.get<string>('REDIS_HOST') ?? 'locahost';
    const port = parseInt(configService.get<string>('REDIS_PORT') ?? '6379');

    const store = new KeyvRedis({
      url: `redis://${redisHost}:${port.toString()}`,
      password: configService.get<string>('REDIS_AUTH') ?? 'docker',
      socket: {
        reconnectStrategy: parseInt(
          configService.get<string>('REDIS_RETRY_INTERVAL') ?? '10000',
        ),
        tls: false,
        keepAlive: 30000,
      },
    });

    return {
      stores: [new Keyv(store)],
    };
  },

  inject: [ConfigService],
};
