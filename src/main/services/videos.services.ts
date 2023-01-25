import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { throwError } from 'rxjs';
import { VideoServiceInterface } from 'src/context/videos/application/videosServiceIterface';
import { User, UserDocument } from '../db/mongo/schemas/user.schema';
import { Video, VideoDocument } from '../db/mongo/schemas/video.schema';

export class VideosServices implements VideoServiceInterface {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async updateVideo(id, dataToUpdate: any) {
    return await this.videoModel.findByIdAndUpdate(id, { ...dataToUpdate });
  }

  async averageScore(idVideo, idUser, scoreVideo) {
    const dataVideo = await this.videoModel.findById(idVideo);
    const { score } = dataVideo;
    const { averageScore, numScore } = score;
    const newNumScore = (numScore || 0) + 1;
    const newAverage = ((averageScore || 0) + scoreVideo) / newNumScore;
    dataVideo.score.averageScore = newAverage;
    dataVideo.score.numScore = newNumScore;

    const dataUser = await this.userModel.findById(idUser).populate({
      path: 'scored.video',
      model: 'Video',
    });
    for (let index = 0; index < dataUser.scored.length; index++) {
      const videoScored = dataUser.scored[index];
      if (videoScored.video.id === idVideo) {
        throw new Error('El usuario ya puntuo esta clase');
      }
    }
    dataUser.scored.push({ video: idVideo, scored: scoreVideo });
    dataUser.save();
    await dataVideo.save();
    return { average: newAverage };
  }
}
