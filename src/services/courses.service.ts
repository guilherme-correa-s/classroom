import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateCourseParams {
  title: string;
}

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  findMany() {
    return this.prisma.course.findMany();
  }

  findUnique(id: string) {
    return this.prisma.course.findUnique({ where: { id } });
  }

  async create({ title }: CreateCourseParams) {
    const slug = slugify(title, { lower: true });
    const courseBySlug = await this.prisma.course.findUnique({
      where: { slug },
    });
    if (courseBySlug) throw new BadRequestException('Slug already exist');
    return this.prisma.course.create({
      data: {
        title,
        slug,
      },
    });
  }
}
