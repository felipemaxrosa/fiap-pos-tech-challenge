import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/envs/${
        process.env.NODE_ENV || 'prod'
      }.env`,
    }),
    ApplicationModule,
  ],
})
export class MainModule {}
