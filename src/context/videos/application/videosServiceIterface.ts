export class VideoServiceInterface {
  updateVideo: (id, data) => Promise<any>;
  averageScore: (idvideo, iduser, score) => Promise<any>;
}
