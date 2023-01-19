import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Categories } from 'src/context/categories/application/categories';
import { RoutesCourses } from 'src/context/paths/application/routes';

@Controller('category')
export class CategoryController {
  constructor(private category: Categories) {}

  @Post('/')
  addCategory(@Body() data: any) {
    return this.category.addCategory(data);
  }

  @Get('/:idDirective')
  getCategory(@Param() data) {
    const { idDirective } = data;
    return this.category.getCategories(idDirective);
  }

  @Get('/')
  getAllCategories() {
    return this.category.getAllCategories();
  }
}
