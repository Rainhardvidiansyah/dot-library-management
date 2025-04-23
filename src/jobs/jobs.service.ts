import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class JobsService {

  private logger = new Logger(JobsService.name, {timestamp: true});

  constructor(@InjectQueue('jobs') private bookQueue: Queue) {}

  async addNewJob(data: any) {
    this.logger.debug(`Add new Job is called`);
    await this.bookQueue.add('new-author', data);
  }
}
