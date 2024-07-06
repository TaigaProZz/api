import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsModule } from './tickets/tickets.module';
import { TicketsBoughtModule } from './tickets_bought/tickets_bought.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'root',
      username: 'postgres',
      database: 'postgres',
      synchronize: true, // delete in production
      logging: true,
      autoLoadEntities: true,
    })
    ,
    UsersModule,
    TicketsModule,
    TicketsBoughtModule,
    PermissionsModule],
})
export class AppModule {}
