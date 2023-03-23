export interface InprogressCoursesInterfaces {
  userId: string;
  instituteId: string;
}

export interface courseServicesInterface {
  inProgress: () => any;
  addCategory: (data) => any;
  getCategories: () => any;
  addCourse: (data) => any;
  getCourses: (id) => any;
  getAllCourses: () => any;
  addVideo: (data) => Promise<any>;
  addVideosToCourse: (idVideo, idCourse) => Promise<any>;
  addCategoryToCourse: (idVideo, idCourse) => Promise<any>;
  addRouteToCourse: (idVideo, idRoute) => Promise<any>;
  videosFromCourse: (idCourse) => Promise<any>;
  updateCourse: (id, data) => Promise<any>;
  uploadCover: (file, video) => Promise<any>;
  uploadVideo: (file, video) => Promise<any>;
  getCoursesForDirective: (directive) => Promise<any>;
  deleteVideo: (course, video) => Promise<any>;
  getFinishedVideoByUser: (idCourse, userid) => Promise<any>;
}
