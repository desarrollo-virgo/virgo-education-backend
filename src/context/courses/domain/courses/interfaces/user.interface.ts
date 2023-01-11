export interface UserServicesInterface {
  getUser: (data) => any;
  getAllUser: () => any;
  AddUser: (data) => any;
  addInProgressCourse: (user, course, video, prevIdVIdeo) => any;
  addFinishedCourse: (user, data) => any;
  getFinishedCourses: (user) => any;
  updateTimeProgress: (user, data) => any;
}
