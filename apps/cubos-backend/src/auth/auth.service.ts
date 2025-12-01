import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod, User } from '__generated__/prisma';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UserService) {}
  public async register(req: Request, dto: RegisterDto) {
    const isExist = await this.userService.findByEmail(dto.email);

    if (isExist) {
      throw new ConflictException('уже есть');
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );

    return this.saveSession(req, newUser);
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException('не найден пользователь');
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('неверный пароль');
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Session not destroy'),
          );
        }

        res.clearCookie('session');

        resolve();
      });
    });
  }

  private async saveSession(req: Request, user: User) {
    return new Promise((res, rej) => {
      req.session.userId = user.id;

      req.session.save((error) => {
        if (error) {
          return rej(new InternalServerErrorException('Session save failed'));
        }

        res({ user });
      });
    });
  }
}
