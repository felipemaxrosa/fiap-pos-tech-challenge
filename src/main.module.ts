import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApplicationModule } from './application/application.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: `${process.cwd()}/envs/${process.env.NODE_ENV || 'prod'}.env`,
      }),
      ApplicationModule,
   ],
})
export class MainModule {}
