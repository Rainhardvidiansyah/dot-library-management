import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
    
    private logger = new Logger(AuthenticationService.name, {timestamp: true});

    constructor(
      private readonly userService: UsersService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService
    ){}

		//VALIDATE TO LOGIN
    async validateUsers(email: string, password: string): Promise<UsersEntity>{
      this.logger.log("Validate users function got hit in Authentication Service class");
      const user = await this.userService.Login(email, password);
      return user;
  }


  //GENERATE JWT TOKEN
  async generateToken(id: number, email: string, role: any): Promise<{ access_token: string } > {

    const payload = {id: id, email: email, role: role };
		this.logger.debug({role: payload.role});

    const generatedToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("JWT_ACCESS_TOKEN"),
        expiresIn: this.configService.get<string>("ACCESS_TOKEN_EXPIRY"),
    })

    this.logger.log(`Generated token is ${generatedToken}`);

    return {
        access_token: generatedToken,
    };
}


    //CREATE A METHOD TO GENERATE REFRESH TOKEN
    async generateRefreshToken(id: number, email: string, role: any): Promise< {refresh_token: string} > {

      const payload = { id: id, email: email, role: role };

      this.logger.log(JSON.stringify(payload, null, 2));

      const generatedToken = await this.jwtService.signAsync(payload, 
      {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
        expiresIn: this.configService.get<string>("REFRESH_TOKEN_EXPIRY"),
      })

      return {
        refresh_token: generatedToken,
      };
  }

  //request -> get cookies -> if it is true --> then generate new Token
  async decodeToken(token: string): Promise<{ id: number; email: string, role: any }> {
		
    try{
        const decodedToken = await this.jwtService.verify(token,
        {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN"),
        }
      )
		
			const {id, email, role} = decodedToken;
			this.logger.log(`email in decoded token method: ${email}`)
			return {id, email, role};

    }catch(error){
      this.logger.error("Invalid refresh token", error);
      throw new UnauthorizedException("Invalid refresh token");
      }
		}
	}

//lesson learned from this: https://docs.nestjs.com/security/authentication
