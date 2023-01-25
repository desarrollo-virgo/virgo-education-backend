import { Body, Controller, Post } from '@nestjs/common';
import { ApplicationWH } from '../../../context/webhoohs/application/application';

@Controller('webhooks')
export class WebhooksController {
  constructor(private application: ApplicationWH) {}
  @Post('/')
  wh(@Body() data) {
    console.log(data);
    if (data.Status !== 3) {
      return true;
    }
    // return this.application.saveVideo(data);
  }
}
