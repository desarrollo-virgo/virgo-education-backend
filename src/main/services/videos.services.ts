import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoServiceInterface } from 'src/context/videos/application/videosServiceIterface';
import { Video, VideoDocument } from '../db/mongo/schemas/video.schema';

export class VideosServices implements VideoServiceInterface {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}
  async updateVideo(id, dataToUpdate: any) {
    return await this.videoModel.findByIdAndUpdate(id, { ...dataToUpdate });
  }
}
