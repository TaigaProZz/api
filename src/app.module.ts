import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeModule } from './type/type.module';

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
    TypeModule],
})
export class AppModule {}
