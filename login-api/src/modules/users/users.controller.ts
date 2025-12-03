import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/criar-usuário.dto';
import { UpdateUsertDto } from './dtos/atualizar-usuário.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { LoginResponse } from './interfaces/users-login.interface';
import type { UserPayload } from './interfaces/users-login.interface';
import type { ExpressRequestWithUser } from './interfaces/express-request-with-user.interface';
import { Public } from '../../common/decorators/public.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsMineGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return parseInt(request.params.id) === request.user.sub;
  }
}

@Controller('users')
export class UsersController {

  //injetando users services
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post('register')
  registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.registerUser(createUserDto);
  }
  @Public()
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<LoginResponse> {
    return this.usersService.loginUser(loginUserDto);
  }


  @Get('me')
  me(@Request() req: ExpressRequestWithUser): UserPayload {
    return req.user;
  }

  @Patch(':id')
  @UseGuards(IsMineGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUsertDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(IsMineGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
    // call users service method to delete user
    return this.usersService.deleteUser(+id);
  }
}
