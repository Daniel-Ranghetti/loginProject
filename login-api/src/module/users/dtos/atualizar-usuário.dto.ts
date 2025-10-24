import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './criar-usuário.dto';

export class UpdateUsertDto extends PartialType(CreateUserDto) {}
