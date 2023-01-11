import { Inject, Injectable } from '@nestjs/common';
import { DirectivesServicesInterface } from '../domain/directive/interfaces/directives.interface';

@Injectable()
export class Directive {
  constructor(
    @Inject('directiveServices') private services: DirectivesServicesInterface,
  ) {}

  getDirectives() {
    return this.services.getDirective();
  }

  addDirective(data) {
    return this.services.addDirective(data);
  }
}
