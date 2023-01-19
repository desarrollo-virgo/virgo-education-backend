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

  async getAllCategories() {
    const resultCategories = await this.services.getAllCategories();
    const allCategories = resultCategories.map((result) => {
      return {
        id: result._id,
        name: result.name,
        description: result.description,
      };
    });
    return this.createResponse(allCategories);
  }

  addCategory(data) {
    return this.services.addCategory(data);
  }

  createResponse(data: any) {
    const response = {
      status: 'ok',
      payload: data,
    };
    return response;
  }
}
