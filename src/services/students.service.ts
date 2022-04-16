import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  findMany() {
    return this.prisma.student.findMany();
  }

  findUnique(id: string) {
    return this.prisma.student.findUnique({
      where: {
        id,
      },
    });
  }

  findUniqueByAuthId(authUserId: string) {
    return this.prisma.student.findUnique({ where: { authUserId } });
  }
}
