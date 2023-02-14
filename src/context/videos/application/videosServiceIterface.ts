export class VideoServiceInterface {
  updateVideo: (id, data) => Promise<any>;
  averageScore: (idvideo, iduser, score) => Promise<any>;
  addQuestions: (idVideo, body) => Promise<any>;
  getQuestions: (idVideo, body) => Promise<any>;
  verifyQuestion: (idVideo, answers) => Promise<any>;
  uploadFile: (file, video) => Promise<any>;
  getFiles: (video) => Promise<any>;
  deleteFile: (video, file) => Promise<any>;
}
