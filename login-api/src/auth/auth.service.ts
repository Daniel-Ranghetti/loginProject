import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // login recebe username e password
  async login(username: string, password: string) {
    // aqui você pode colocar a lógica real de autenticação
    // por enquanto, só retorna uma mensagem de teste
    return { message: `Usuário ${username} logado!` };
  }

  // register recebe username, email e password
  async register(username: string, email: string, password: string) {
    // lógica de criação de usuário real viria aqui
    return { message: `Usuário ${username} (${email}) registrado!` };
  }
}
