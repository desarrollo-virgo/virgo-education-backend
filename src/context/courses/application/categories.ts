import { Inject, Injectable } from '@nestjs/common';
import { categoriesServicesInterface } from '../domain/courses/interfaces/categories.interface';

@Injectable()
export class Categories {
  constructor(
    @Inject('categoryServices') private services: categoriesServicesInterface,
  ) {}

  getCategories(idDirective) {
    return this.services.getCategories(idDirective);
  }

  getAllCategories() {
    return this.services.getAllCategories();
  }

  addCategory(data) {
    return this.services.addCategory(data);
  }
}
