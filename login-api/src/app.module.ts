import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CoreModule } from './core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
  imports: [
    UsersModule,
    CoreModule,
    JwtModule.register({
      global: true,
      secret: 'Senha secreta',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: 'APP_GUARD',
    useClass: AuthGuard
  }],
})
export class AppModule {}
