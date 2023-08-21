import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PresentationModule } from 'src/presentation/presentation.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: `${process.cwd()}/envs/${process.env.NODE_ENV || 'prod'}.env`,
      }),
      PresentationModule,
   ],
})
export class MainModule {}
