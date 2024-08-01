import * as bcrypt from 'bcrypt';
import { Controller, Get, Post, Body, Param, Delete, BadRequestException, Put, UsePipes, ValidationPipe, Res, Response, Req, NotFoundException, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/publicRoute.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/users.entity';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Public()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    // hash password
    const saltOrRounds = 10;
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    createUserDto.password = hash;
    createUserDto.permissionId = 1;
    
    try {
      await this.usersService.create(createUserDto);  
      return {
        code: 201,
        message: 'User created successfully'
      };
    } catch (error) {
      // if email already exists, throw an error
      if (error.code === '23505') throw new BadRequestException('Email already exists');
      throw new BadRequestException('Bad request');
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findOne(@Req() req: Request) {        
    try {      
      const user = await this.usersService.findOne(+req?.user.id);      

      // if 2fa is not activated, throw an error and don't fetch user data
      if(!user.doubleAuthActive) {
        throw new BadRequestException('2fa is not activated');
      }
      
      return user;
    } catch (error) {
      console.log("error fetching user : ", error.message);
      if (error.message === 'invalid token') {
        throw new NotFoundException('Bad token');
      }
      if (error.message === '2fa is not activated') {
        throw new BadRequestException('2fa is not activated');
      }
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Put()
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {    
    const token = req.cookies.session;
    try {
      const tokenContent: User = await this.jwtService.verifyAsync(token);
      return this.usersService.update(+tokenContent.id, updateUserDto);
    } catch (error) {
      console.log(error.message);
      if (error.message === 'invalid token') {
        throw new NotFoundException('Bad token');
      }
    }
  }
  
  @Delete()
  async remove(@Req() req: Request) {
    const token = req.cookies.session;
    try {
      const tokenContent: User = await this.jwtService.verifyAsync(token);
      return this.usersService.remove(+tokenContent.id);
    } catch (error) {
      console.log(error.message);
      if (error.message === 'invalid token') {
        throw new NotFoundException('Bad token');
      }
    }
  }
}
