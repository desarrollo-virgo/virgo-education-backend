import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoServiceInterface } from 'src/context/videos/application/videosServiceIterface';
import {
  Question,
  QuestionDocument,
} from '../db/mongo/schemas/question.schema';
import { User, UserDocument } from '../db/mongo/schemas/user.schema';
import { Video, VideoDocument } from '../db/mongo/schemas/video.schema';

export class VideosServices implements VideoServiceInterface {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Question.name) private questionsModel: Model<QuestionDocument>,
  ) {}
  async updateVideo(id, dataToUpdate) {
    await this.videoModel.findByIdAndUpdate(id, { ...dataToUpdate });
  }

  async addQuestions(idVideo, body) {
    body['video'] = idVideo;
    const question = await this.questionsModel.findByIdAndUpdate(
      idVideo,
      body,
      {
        upsert: true,
        new: true,
      },
    );
    const questionJSON = question.toJSON();
    delete questionJSON['_id'];
    delete questionJSON['__v'];
    return questionJSON;
  }

  async getQuestions(idVideo, body) {
    body['video'] = idVideo;
    const question = await this.questionsModel.findById(idVideo);
    if (!question) {
      return null;
    }
    const questionJSON = question.toJSON();
    delete questionJSON['_id'];
    delete questionJSON['__v'];
    return questionJSON;
  }
  async verifyQuestion(idVideo, question, option) {
    const optionSelected = Number(option);
    const numberQuestion = Number(question);
    const verify = await this.questionsModel.findById(idVideo);
    let questionResponse = false;
    const questionSelect = verify.questions.filter((question) => {
      return question.number === numberQuestion;
    });
    if (questionSelect.length === 0) {
      return '';
    }
    questionSelect[0].options.forEach((question) => {
      if (question.number === optionSelected && question.correct) {
        questionResponse = true;
      }
    });
    // const questionJSON = question.toJSON();
    // delete questionJSON['_id'];
    // delete questionJSON['__v'];
    return questionResponse;
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
