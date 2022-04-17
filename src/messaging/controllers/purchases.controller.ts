import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CoursesService } from 'src/services/courses.service';
import { EnrollmentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';

export interface PurchaseCreatedPayload {
  customer: Customer;
  product: Product;
}

export interface Customer {
  authUserId: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
}

@Controller()
export class PurchasesController {
  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  @EventPattern('purchases.new-purchase')
  async purchasesCreated(@Payload('value') payload: PurchaseCreatedPayload) {
    let student = await this.studentsService.findUniqueByAuthId(
      payload.customer.authUserId,
    );
    if (!student) {
      student = await this.studentsService.create(payload.customer.authUserId);
    }

    let course = await this.coursesService.findUniqueBySlug(
      payload.product.slug,
    );
    if (!course) {
      course = await this.coursesService.create({
        title: payload.product.title,
        slug: payload.product.slug,
      });
    }

    await this.enrollmentsService.create({
      studentId: student.id,
      courseId: course.id,
    });
  }
}
