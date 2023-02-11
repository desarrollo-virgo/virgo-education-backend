export class VideoServiceInterface {
  updateVideo: (id, data) => Promise<any>;
  averageScore: (idvideo, iduser, score) => Promise<any>;
  addQuestions: (idVideo, body) => Promise<any>;
  getQuestions: (idVideo, body) => Promise<any>;
  verifyQuestion: (idVideo, question, option) => Promise<any>;
}
