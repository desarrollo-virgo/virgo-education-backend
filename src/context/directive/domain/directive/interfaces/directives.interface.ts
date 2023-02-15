export interface DirectivesServicesInterface {
  addDirective: (data) => any;
  getDirectives: () => any;
  getDirective: (id) => any;
  excludeCourse: (directive, course) => any;
}
