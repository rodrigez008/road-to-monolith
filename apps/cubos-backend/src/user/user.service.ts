import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}
}
