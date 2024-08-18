import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: parseInt(configService.get<string>('REDIS_PORT') || '6379'),
        reconnectStrategy: parseInt(
          configService.get<string>('REDIS_RETRY_INTERVAL') || '10000',
        ),
      },
      password: configService.get<string>('REDIS_AUTH') || 'docker',
      ttl: 0,
    });

    return {
      store: () => store,
    };
  },

  inject: [ConfigService],
};
