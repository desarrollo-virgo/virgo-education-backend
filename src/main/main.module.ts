import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureStorageModule } from '@nestjs/azure-storage';

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
import { RoutesCourses } from 'src/context/paths/application/routes';
import { RoutesController } from './rest/routes/routes.controller';
import { CategoryController } from './rest/categories/category.controller';
import { Categories } from 'src/context/categories/application/categories';
import { UserServices } from './services/user.services';
import { UserController } from './rest/users/user.controller';
import { Users } from 'src/context/user/application/users';
import { WebhooksController } from './rest/webhooks/webhooks.controller';
import { ApplicationWH } from 'src/context/webhoohs/application/application';
import { WebhooksServices } from './services/webhooks.service';
import { GoogleSheetClient } from './external/googleSheet/googleSheetClient';
import { VideosServices } from './services/videos.services';
import { VideosController } from './rest/videos/videos.controller';
import { Videos } from 'src/context/videos/application/videos';
import { TagsServices } from './services/tags.services';
import { TagsController } from './rest/tags/tags.controller';
import { Tags } from 'src/context/tags/application';

@Module({
  imports: [
    HttpModule,
    MongoModule,
    ConfigModule.forRoot({
      load: [config],
    }),
    AzureStorageModule.withConfig({
      sasKey: process.env['AZURE_STORAGE_SAS_KEY'],
      accountName: process.env['AZURE_STORAGE_ACCOUNT'],
      containerName: 'virgostore',
    }),
  ],
  controllers: [
    CoursesController,
    DirectivesController,
    RoutesController,
    CategoryController,
    UserController,
    WebhooksController,
    VideosController,
    TagsController,
  ],
  providers: [
    Courses,
    Directive,
    Categories,
    Users,
    Videos,
    RoutesCourses,
    Tags,
    CoursesServices,
    CategoryServices,
    RouteServices,
    ApplicationWH,
    WebhooksServices,
    GoogleSheetClient,
    VideosServices,
    TagsServices,
    { provide: 'courseServices', useClass: CoursesServices },
    { provide: 'directiveServices', useClass: DirectiveServices },
    { provide: 'routeServices', useClass: RouteServices },
    { provide: 'categoryServices', useClass: CategoryServices },
    { provide: 'userServices', useClass: UserServices },
    { provide: 'webhooksServices', useClass: WebhooksServices },
    { provide: 'videoServices', useClass: VideosServices },
    { provide: 'tagServices', useClass: TagsServices },
  ],
  exports: [CoursesServices],
})
export class MainModule {}
