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
  Res,
  UseGuards
} from '@nestjs/common';
import type { Response } from 'express';
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
import { IsMineGuard }from '../../common/guards/auth.guard'



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
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const loginResponse = await this.usersService.loginUser(loginUserDto);
    
    res.cookie('access_token', loginResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 10 * 1000, // 10 segundos
    });
    
    return loginResponse;
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
