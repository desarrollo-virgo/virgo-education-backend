import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DirectivesServicesInterface } from 'src/context/directive/domain/directive/interfaces/directives.interface';
import {
  Directives,
  DirectivesDocument,
} from 'src/main/db/mongo/schemas/directive.schema';

export class DirectiveServices implements DirectivesServicesInterface {
  constructor(
    @InjectModel(Directives.name)
    private directive: Model<DirectivesDocument>,
  ) {}

  async addDirective(data: any) {
    return await this.directive.create(data);
  }

  async getDirectives() {
    return await this.directive.find({});
  }

  async getDirective(idDirective) {
    return await this.directive.findById(idDirective);
  }

  async excludeCourse(directive: any, course: any) {
    const result = await this.directive.findById(directive);
    if (result.excludeCourses.indexOf(course) < 0) {
      result.excludeCourses.push(course);
      return result.save();
    }
    return 'no se puede volver a agregar un curso';
  }

  async includeCourse(directive: any, course: any) {
    const result = await this.directive.findById(directive);
    const courseInd = result.excludeCourses.indexOf(course);
    if (courseInd >= 0) {
      result.excludeCourses.splice(courseInd, 1);
      return result.save();
    }
    return 'no se puede eliminar el curso';
  }
}
