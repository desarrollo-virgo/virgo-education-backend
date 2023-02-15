export interface UserServicesInterface {
  getUser: (data) => any;
  getAllUser: () => any;
  AddUser: (data) => any;
  addInProgressCourse: (user, course, video, prevIdVIdeo) => any;
  addFinishedCourse: (user, data) => any;
  getFinishedCourses: (user) => any;
  updateTimeProgress: (user, data) => any;
  readSheet: () => any;
  addWishList: (idUser, idCourse) => any;
  removeWishList: (idUser, idCourse) => any;
  generateCertificate: (body) => any;
  getProgressInfo: (idUser) => any;
  getInfoProfessors: () => any;
  enableUser: (idUser, enable) => any;
  getUserForDirective: (directive) => any;
}
