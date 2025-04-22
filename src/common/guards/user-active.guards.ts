import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class UserActiveGuard implements CanActivate{

  private logger = new Logger(UserActiveGuard.name, {timestamp: true});

  constructor(private readonly userService: UsersService){}


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.user;

    console.log("[User Active Guard] User email is: ", email);
    const user = await this.userService.findUserByEmail(email);
    
    if(!user || !user.isActive){

      this.logger.log(`Email user [User Active Guard]: ${email}`)

      console.log("Email user [User Active Guard]: " + email);
      throw new UnauthorizedException('User has not activated the account');
    }
      return true;
  }
}