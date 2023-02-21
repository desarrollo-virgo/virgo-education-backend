import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagServicesInterfaces } from 'src/context/tags/domain/tagServices.interface';
import { Tag, TagDocument } from '../db/mongo/schemas/tags.schema';

export class TagsServices implements TagServicesInterfaces {
  constructor(@InjectModel(Tag.name) private tagsModel: Model<TagDocument>) {}

  async getTags() {
    const result = await this.tagsModel.find({});
    const tags = result.map((tag) => {
      return tag.name;
    });
    return tags;
  }
}
