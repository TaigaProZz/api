import configuration from './config/configuration';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

// modules
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { TicketsBoughtModule } from './tickets_bought/tickets_bought.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { PermissionsGuard } from './permissions/permission.guard';
import { StripeModule } from './stripe/stripe.module';

// config
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dynamicImport } from './config/dynamicImport';

// entities
import { TicketsBought } from './tickets_bought/entities/tickets_bought.entity';
import { Ticket } from './tickets/entities/ticket.entity';
import { User } from './users/entities/users.entity';

// services
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    // dashboard adminjs
    // dynamicImport('@adminjs/nestjs').then(({ AdminModule }) => AdminModule.createAdminAsync({
    //   imports: [UsersModule, AuthModule, ConfigModule],
    //   useFactory: (authService: AuthService, configService: ConfigService) => ({
    //     adminJsOptions: {
    //       rootPath: '/admin',
    //       resources: [
    //         { resource: Ticket },
    //         { resource: TicketsBought },
    //         // add user resource but hide it in the admin panel
    //         { resource: User, options: { navigation: false}},
    //       ],
    //     },
    //     auth: {
    //       authenticate: async (email, password) => {    
    //         try {
    //           return await authService.signInBackoffice(email, password);
    //         } catch (error) {
    //           return null;
    //         }
    //       },
    //       cookieName: 'adminjs', 
    //       cookiePassword: configService.get<string>('adminjsCookiePassword')
    //     },
    //     sessionOptions: {
    //       resave: true,
    //       saveUninitialized: true,
    //       secret: configService.get<string>('adminJsSessionSecret')
    //     },
    //   }),
    //   inject: [AuthService, ConfigService],  
    // })),
    // config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    // database connection with typeorm
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        synchronize: true, // delete in production
        logging: true,
        autoLoadEntities: true,
        ssl: {
          rejectUnauthorized: false, 
        }
      }),
      inject: [ConfigService]
    }),
    // modules
    UsersModule,
    TicketsModule,
    TicketsBoughtModule,
    PermissionsModule,
    AuthModule,
    StripeModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
