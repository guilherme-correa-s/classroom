import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateCourseParams {
  title: string;
  slug?: string;
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

  findUniqueBySlug(slug: string) {
    return this.prisma.course.findUnique({
      where: { slug },
    });
  }

  async create({
    title,
    slug = slugify(title, { lower: true }),
  }: CreateCourseParams) {
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
