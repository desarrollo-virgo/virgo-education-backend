export class UseCaseCourses {
  buildPayload(data: any[]) {
    const courses = data.map((course) => {
      const courseInfo = {
        id: course._id,
        name: course.name,
        description: 'educacion',
        tags: course.tags,
        score: course.score,
        guid: 'f5f103b7-dc5d-415b-ad97-18847d8ee04a',
        category: course.category,
        route: course.route,
      };
      return courseInfo;
    });
    return courses;
  }

  buildPayloadVideos(data) {
    const videosInfo = data.videos.map((video) => {
      return {
        id: video.id,
        name: video.name,
        duration: video.duration,
        thumbnail: this.createThumbnail(video),
        guid: video.guid,
        position: video.num,
        urlEmbed: this.createUrlVideoEmbed(video),
      };
    });
    return videosInfo;
  }

  createThumbnail(video) {
    const url = 'https://vz-49107a3c-cdb.b-cdn.net';
    return `${url}/${video.guid}/${video.thumbnail}`;
  }

  createUrlVideoEmbed(video) {
    const streamManagerID = 80619;
    const url = 'https://iframe.mediadelivery.net/embed/';
    return `${url}/${streamManagerID}/${video.guid}`;
  }
}
