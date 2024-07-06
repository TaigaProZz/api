import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PermissionsController } from 'src/permissions/permissions.controller';
import { Permission } from 'src/permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Permission])],
  controllers: [UsersController, PermissionsController],
  providers: [UsersService, PermissionsService],
})
export class UsersModule {}
