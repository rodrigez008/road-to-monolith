import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod } from '__generated__/prisma/enums';

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UserService) {}
  public async register(dto: RegisterDto) {
    const isExist = await this.userService.findById(dto.email);

    if (isExist) {
      throw new ConflictException('уже есть');
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.name,
      dto.password,
      '',
      AuthMethod.CREDENTIALS,
      false,
    );

    return newUser;
  }

  public async login() {}
  public async logout() {}

  private async saveSession() {}
}
