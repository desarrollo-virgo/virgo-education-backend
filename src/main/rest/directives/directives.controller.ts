import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
}
