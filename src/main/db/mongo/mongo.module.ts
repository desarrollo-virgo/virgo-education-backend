import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigMongo } from './config';
import { MongoService } from './mongo.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Course, CourseSchema } from './schemas/course.schema';
import { Directives, DirectivesSchema } from './schemas/directive.schema';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { RouteCourses, RouteCoursesSchema } from './schemas/route.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Video, VideoSchema } from './schemas/video.schema';
import {
  VideoFinished,
  VideoFinishedSchema,
} from './schemas/videosFinished.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: ConfigMongo,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
      { name: Directives.name, schema: DirectivesSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: RouteCourses.name, schema: RouteCoursesSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Video.name, schema: VideoSchema },
      { name: VideoFinished.name, schema: VideoFinishedSchema },
    ]),
  ],
  providers: [
    MongoService,
    { provide: 'dbMongo', useClass: MongoService },
    ConfigMongo,
    ConfigService,
  ],
  exports: [MongooseModule, { provide: 'dbMongo', useClass: MongoService }],
})
export class MongoModule {}
