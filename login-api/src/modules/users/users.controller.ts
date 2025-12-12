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
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUsertDto } from './dtos/update-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { LoginResponse } from './interfaces/users-login.interface';
import type { UserPayload } from './interfaces/users-login.interface';
import type { ExpressRequestWithUser } from './interfaces/express-request-with-user.interface';
import { Public } from '../../common/decorators/public.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IsMineGuard } from '../../common/guards/auth.guard';

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

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    };

    if (loginUserDto.keepLogged) {
      cookieOptions.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
    } else {
      cookieOptions.maxAge = 5 * 1000; // 5 segundos
    }

    res.cookie('access_token', loginResponse.access_token, cookieOptions);
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
