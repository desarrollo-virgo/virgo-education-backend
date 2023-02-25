import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoServiceInterface } from 'src/context/videos/application/videosServiceIterface';
import { Course, CoursesDocument } from '../db/mongo/schemas/course.schema';
import {
  Directives,
  DirectivesDocument,
} from '../db/mongo/schemas/directive.schema';
import {
  Question,
  QuestionDocument,
} from '../db/mongo/schemas/question.schema';
import { User, UserDocument } from '../db/mongo/schemas/user.schema';
import { Video, VideoDocument } from '../db/mongo/schemas/video.schema';

export class VideosServices implements VideoServiceInterface {
  azureConnection =
    'DefaultEndpointsProtocol=https;AccountName=virgostore;AccountKey=Hi3flZFsAiHMLkS4V/x/ZDP9cS3R7hgI4+6L5BVL25Ezf8AiKlzsxLRJpD2kwJYXcmtnhbwBDS1E+ASt6HKGfw==;EndpointSuffix=core.windows.net';
  containerName = 'files';
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Question.name) private questionsModel: Model<QuestionDocument>,
    @InjectModel(Directives.name) private directive: Model<DirectivesDocument>,
    @InjectModel(Course.name) private course: Model<CoursesDocument>,
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

  async getQuestions(idVideo, body, verify: string) {
    body['video'] = idVideo;
    const question = await this.questionsModel.findById(idVideo);
    if (!question) {
      return null;
    }
    const questionJSON = question.toJSON();
    delete questionJSON['_id'];
    delete questionJSON['__v'];
    if (verify === 'false') {
      questionJSON.questions.forEach((question) => {
        question.options.forEach((option) => {
          delete option.correct;
        });
      });
    }
    return questionJSON;
  }
  async verifyQuestion(idVideo, answers) {
    const questionData = await this.questionsModel.findById(idVideo);
    const verifyData = [...answers.responses];
    questionData.questions.forEach((question, index) => {
      answers.responses.forEach((answer) => {
        this.verifyOption(answer, question, verifyData, index);
      });
    });
    return verifyData;
  }

  verifyOption(answer: any, question: any, verifyData, index) {
    if (answer.numberQuestion === question.number) {
      question.options.forEach((quest) => {
        if (answer.numberOption === quest.number) {
          verifyData[index]['correct'] = quest.correct;
        }
      });
    }
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
      if (videoScored.video?.id === idVideo) {
        throw new Error('El usuario ya puntuo esta clase');
      }
    }
    dataUser.scored.push({ video: idVideo, scored: scoreVideo });
    dataUser.save();
    await dataVideo.save();
    return { average: newAverage };
  }

  getBlobClient(imageName: string, containerName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerClient = blobClientService.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async addFile(dataFile, video) {
    const videoData = await this.videoModel.findById(video);
    if (videoData.files && videoData.files.length === 0) {
      videoData.files.push(dataFile);
    } else {
      videoData.files = videoData.files.concat(dataFile);
    }
    const result = await videoData.save();
    const resultObj = result.toObject();
    resultObj.files.forEach((file) => {
      file['id'] = file['_id'];
    });
    return resultObj.files;
  }
  async uploadFile(file: Express.Multer.File, video) {
    const containerName = 'files';
    const fileParts = file.originalname.split('.');
    const extension = fileParts[fileParts.length - 1];
    const fileName = `${video}-${fileParts[0]}`;
    const _fileName = `${fileName}.${extension}`;
    const blobClient = this.getBlobClient(_fileName, containerName);
    const url = `https://virgostore.blob.core.windows.net/${containerName}/${_fileName}`;
    const dataFile = {
      name: _fileName,
      url,
    };
    console.log('subiendo archivo...');
    await blobClient.uploadData(file.buffer);
    const resultVideoDB = await this.addFile(dataFile, video);
    return resultVideoDB;
  }

  async getFiles(video) {
    const result = await this.videoModel.findById(video);
    const resultObj: any = result.toObject();
    resultObj.files.forEach((file) => {
      file['id'] = file['_id'];
      delete file._id;
    });
    return resultObj.files;
  }

  async deleteFileStorage(name) {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerName = 'files';
    const containerClient = blobClientService.getContainerClient(containerName);
    const containerFile = containerClient.getBlockBlobClient(name);
    await containerFile.delete();
  }

  async deleteVideoStorage(name) {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerName = 'videos';
    const containerClient = blobClientService.getContainerClient(containerName);
    const containerFile = containerClient.getBlockBlobClient(name);
    await containerFile.delete();
  }

  async deleteVideo(idVideo, idCourse) {
    const video = await this.videoModel.findById(idVideo);
    const course = await this.course.findById(idCourse);
    await this.deleteFileStorage(video.url);

    const newListVideos = course.videos.filter((video) => {
      return video !== idVideo;
    });
    course.videos = newListVideos;
    course.save();
    video.delete();
    return course;
  }

  async deleteFile(video, idFile) {
    const result = await this.videoModel.findById(video);
    const nameFile: any = result.files.filter((file) => {
      return file.id === idFile;
    });
    if (nameFile.length > 0) {
      await this.deleteFileStorage(nameFile[0].name);
    }
    const newListFile = result.files.filter((file) => {
      return file.id !== idFile;
    });
    result.files = newListFile;
    result.save();
    const resultObj: any = result.toObject();
    resultObj.files.forEach((file) => {
      file['id'] = file['_id'];
      delete file._id;
    });
    return resultObj.files;
  }

  async getVideosForDirective(idDirectiva) {
    return await this.directive
      .findById(idDirectiva)
      .populate('excludeCourses');
  }

  async verifyUploadVideo(idVideo) {
    const result = await this.videoModel.findById(idVideo);
    return result.uploaded;
  }
}
