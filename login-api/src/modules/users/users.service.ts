import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginResponse, UserPayload } from './interfaces/users-login.interface';
import { UpdateUsertDto } from './dtos/update-user.dto';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';

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
      // Checar se já existe usuário com o mesmo email
      const existing = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existing) {
        throw new ConflictException('Email já registrado');
      }
      //Criar um novo usuario usando o prisma client
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: await hash(createUserDto.password, 10), //hash a senha do usuario
          name: createUserDto.name,
        },
      });
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar usuário');
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
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado`);
      }
      if (updateUserDto.email) {
        const userWithEmail = await this.prisma.user.findUnique({
          where: { email: updateUserDto.email },
        });

        if (userWithEmail && userWithEmail.id !== id) {
          throw new ConflictException('Email já registrado por outro usuário');
        }
      }

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
      throw new InternalServerErrorException('Erro ao atualizar usuário');
    }
  }

  async deleteUser(id: number): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`Usuário com id ${id} não encontrado`);
      }

      await this.prisma.user.delete({
        where: { id },
      });

      return `Usuário com id ${user.id} deletado`;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar usuário');
    }
  }
}
