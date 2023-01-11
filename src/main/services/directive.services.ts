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

  addDirective(data: any) {
    return this.directive.create(data);
  }

  getDirective() {
    return this.directive.find({});
  }
}
