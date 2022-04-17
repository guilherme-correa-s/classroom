import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user.param';
import { EnrollmentsService } from 'src/services/enrollments.service';
import { StudentsService } from 'src/services/students.service';
import { Enrollment } from '../model/enrollment.model';
import { Student } from '../model/student.model';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(
    private studentsService: StudentsService,
    private enrollmentsService: EnrollmentsService,
  ) {}

  // @UseGuards(AuthorizationGuard)
  // @Query(() => Student)
  // me(@CurrentUser() user: AuthUser) {
  //   return this.studentsService.findUniqueByAuthId(user.sub);
  // }

  @UseGuards(AuthorizationGuard)
  @Query(() => [Student])
  students() {
    return this.studentsService.findMany();
  }

  @ResolveField(() => [Enrollment])
  enrollments(@Parent() student: Student) {
    return this.enrollmentsService.findManyByStudentId(student.id);
  }
}
