import { Injectable } from '@nestjs/common';
import { CoursesServices } from 'src/main/services/courses.services';
import { WebhooksServices } from '../../../main/services/webhooks.service';

@Injectable()
export class ApplicationWH {
  constructor(
    private readonly serviceCourses: CoursesServices,
    private readonly serviceWh: WebhooksServices,
  ) {}
  async saveVideo(info: any) {
    const getInfo = await this.serviceWh.getInfoVideos(info);
    const {
      collectionId,
      videoLibraryId,
      length,
      thumbnailFileName,
      guid: videoid,
      title,
    } = getInfo;

    const fileName = title.split('.');
    const titleVideo = fileName[1];
    const num = fileName[0];
    const collectionsInfo = await this.serviceWh.getInfoCollection(
      collectionId,
      videoLibraryId,
    );
    const { name, guid: courseid } = collectionsInfo;

    const courseData = {
      name: name,
      description: name,
      score: 0,
      guid: courseid,
    };
    const videoData = {
      name: titleVideo,
      duration: length,
      thumbnail: thumbnailFileName,
      guid: videoid,
      num,
    };
    let course = await this.serviceCourses.getCoursesForName(name);
    if (!course) {
      course = await this.serviceCourses.addCourse(courseData);
    }
    const video = await this.serviceCourses.addVideo(videoData);
    await this.serviceCourses.addVideosToCourse(video.id, course.id);
  }
}
