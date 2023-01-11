import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Courses } from 'src/context/courses/application/courses';
import { MongoModule } from './db/mongo/mongo.module';
import { CoursesController } from './rest/courses/courses.controller';
import { CoursesServices } from './services/courses.services';
import config from '../configuration/config';
import { CategoryServices } from './services/category.services';
import { RouteServices } from './services/route.services';
import { DirectivesController } from './rest/directives/directives.controller';
import { DirectiveServices } from './services/directive.services';
import { Directive } from 'src/context/directive/application/directive';
import { RoutesCourses } from 'src/context/courses/application/routes';
import { RoutesController } from './rest/routes/routes.controller';
import { CategoryController } from './rest/categories/category.controller';
import { Categories } from 'src/context/courses/application/categories';
import { UserServices } from './services/user.services';
import { UserController } from './rest/users/user.controller';
import { Users } from 'src/context/courses/application/users';
import { WebhooksController } from './rest/webhooks/webhooks.controller';
import { ApplicationWH } from 'src/context/webhoohs/application/application';
import { WebhooksServices } from './services/webhooks.service';
@Module({
  imports: [
    HttpModule,
    MongoModule,
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [
    CoursesController,
    DirectivesController,
    RoutesController,
    CategoryController,
    UserController,
    WebhooksController,
  ],
  providers: [
    Courses,
    Directive,
    Categories,
    Users,
    RoutesCourses,
    CoursesServices,
    CategoryServices,
    RouteServices,
    ApplicationWH,
    WebhooksServices,
    { provide: 'courseServices', useClass: CoursesServices },
    { provide: 'directiveServices', useClass: DirectiveServices },
    { provide: 'routeServices', useClass: RouteServices },
    { provide: 'categoryServices', useClass: CategoryServices },
    { provide: 'userServices', useClass: UserServices },
    { provide: 'webhooksServices', useClass: WebhooksServices },
  ],
  exports: [CoursesServices],
})
export class MainModule {}
