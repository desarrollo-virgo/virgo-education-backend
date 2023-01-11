import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhooksServices {
  constructor(private readonly httpService: HttpService) {}

  async getInfoVideos(videoDate): Promise<any> {
    const url =
      'https://video.bunnycdn.com/library/80619/videos/' + videoDate.VideoGuid;

    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          AccessKey: '836940bd-117c-4c08-aca948393b6f-eef0-4829',
        },
      }),
    );
    return data;
  }

  async getInfoCollection(collectionId, videoLibraryId): Promise<any> {
    const url = `https://video.bunnycdn.com/library/${videoLibraryId}/collections/${collectionId}`;
    const { data } = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          AccessKey: '836940bd-117c-4c08-aca948393b6f-eef0-4829',
        },
      }),
    );
    return data;
  }
}
