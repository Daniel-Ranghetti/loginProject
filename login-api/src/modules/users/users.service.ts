import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateUserDto } from './dtos/criar-usuário.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
import { UpdateUsertDto } from './dtos/atualizar-usuário.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      //Criar um novo usuario usando o prisma client
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: await hash(createUserDto.password, 10), //hash a senha do usuario
          name: createUserDto.name,
        },
      });
      //remove a senha da resposta
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      // checa se o email ja ta registrado e mostra o erro
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      // da um erro qualquer
      throw new HttpException(error, 500);
    }
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    //encontra o usuario pelo email
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });
    //checa se o usuario existe
    if (!user) {
      throw new NotFoundException('Usuario não encontrado');
    }
    //checa se a senha ta correta comparando com a senha hashada na database
    if (!(await compare(loginUserDto.password, user.password))) {
      throw new UnauthorizedException('Credencial Invalida');
    }
    const payload: UserPayload = {
      // cria payload para a JWT
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    return {
      //retorna o token de acesso
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUsertDto,
  ): Promise<Omit<User, 'password'>> {
    try {
      // Encontra o usuario pelo id. se não encontra da erro
      await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });

      //atualiza usuario usando o prisma client
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...UpdateUsertDto,
          //se a senha é provida, hasha ela
          ...(updateUserDto.password && {
            password: await hash(updateUserDto.password, 10),
          }),
        },
      });

      //remove a senha da resposta
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      //checa se o usuario é encontrado e da o erro
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      //checa de o email ja existe e da erro
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }

      //da erro qualquer
      throw new HttpException(error, 500);
    }
  }

  async deleteUser(id: number): Promise<string> {
    try {
      // find user by id. If not found, throw error
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });

      // delete user using prisma client
      await this.prisma.user.delete({
        where: { id },
      });

      return `User with id ${user.id} deleted`;
    } catch (error) {
      // check if user not found and throw error
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // throw error if any
      throw new HttpException(error, 500);
    }
  }
}
