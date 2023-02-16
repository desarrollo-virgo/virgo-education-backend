import { Body, Controller, Get, Post, Query, Param } from '@nestjs/common';
import { Directive } from 'src/context/directive/application/directive';

@Controller('directive')
export class DirectivesController {
  constructor(private directive: Directive) {}

  @Post('/')
  addDirective(@Body() data) {
    return this.directive.addDirective(data);
  }

  @Get('/')
  getDirectives() {
    return this.directive.getDirectives();
  }

  @Get('/:idDirective')
  getDirective(@Param() params) {
    const { idDirective } = params;
    return this.directive.getDirective(idDirective);
  }

  @Post('/:idDirective/exclude')
  excludeCourse(@Param() params, @Body() body) {
    const { course } = body;
    const { idDirective } = params;
    return this.directive.excludeCourse(idDirective, course);
  }

  @Post('/:idDirective/include')
  includeCourse(@Param() params, @Body() body) {
    const { course } = body;
    const { idDirective } = params;
    return this.directive.includeCourse(idDirective, course);
  }
}
