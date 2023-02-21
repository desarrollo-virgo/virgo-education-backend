import { Controller, Get } from '@nestjs/common';
import { Tags } from 'src/context/tags/application';

@Controller('tags')
export class TagsController {
  constructor(private tags: Tags) {}

  @Get('/')
  RouteAllCourses() {
    return this.tags.getTags();
  }
}
