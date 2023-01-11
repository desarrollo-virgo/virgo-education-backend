import { IsNumber, IsString } from 'class-validator';

export class InprogressCoursesDTO {
  @IsString()
  userId: string;
  @IsString()
  instituteId: string;
}

export class RecommendedCoursesDTO {
  @IsString()
  instituteId: string;
}

export class CategoryForCoursesDTO {
  @IsString()
  instituteId: string;
}

export class RouteDTO {
  @IsString()
  instituteId: string;
}

export class SetInProgressCourseDTO {
  @IsNumber()
  courseId: number;
  @IsString()
  userId: string;
}
