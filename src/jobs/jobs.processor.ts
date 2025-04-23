import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";


@Processor('jobs')
export class JobsProcessor{


  private logger = new Logger(JobsProcessor.name, {timestamp: true});
  
  @Process('new-user')
  async handleNewBookJob(job: Job) { //TODO: IMPLEMENT THIS AT AUTHENTICATION CONTROLLER FOR REGISTRATION
    console.log('Processing new data email:', job.data.email);
    this.logger.debug(`Jobs got new user data: ${job.data.email}`)
    await this.fakeSendNotification(job.data.email);
  }

  @Process('new-author')
  async handleNewUser(job: Job){
    console.log('Processing new author job:', job.data.author);
    this.logger.debug(`Jobs got new user data: ${job.data.author}`)
    await this.fakeSendNotification(job.data.author);
  }

  private async fakeSendNotification(data: any) {
    console.log(`New inserted data --- Notification Sent: ${JSON.stringify(data)} has been added to collection`); //This should be a real notification
  }
}