import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { CoursesService } from 'src/services/courses.service';
import { EnrollmentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';
import { Course } from '../model/course.model';
import { Enrollment } from '../model/enrollment.model';
import { Student } from '../model/student.model';

@Resolver(() => Enrollment)
export class EnrollmentsResolver {
  constructor(
    private enrollmentsService: EnrollmentsService,
    private studentsService: StudentsService,
    private coursesService: CoursesService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => [Enrollment])
  enrollments() {
    return this.enrollmentsService.findMany();
  }

  @ResolveField(() => Student)
  student(@Parent() enrollment: Enrollment) {
    return this.studentsService.findUnique(enrollment.studentId);
  }

  @ResolveField(() => Course)
  course(@Parent() enrollment: Enrollment) {
    return this.coursesService.findUnique(enrollment.courseId);
  }
}
