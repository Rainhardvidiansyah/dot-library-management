import { Injectable, CanActivate, Logger, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Request } from "express";

@Injectable()
export class JWTAuthGuard implements CanActivate{

    private readonly logger = new Logger(JWTAuthGuard.name);

    constructor(
      private jwtService: JwtService,
      private reflector: Reflector,
      private configService: ConfigService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        this.logger.log('canActivate method is being called in Jwt Auth Guard class');

        // Check if the route is marked as public
        //if it is Public then no need to check jwt token. 
      
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(isPublic){
            return true;
        }

        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException();
        }

        try{
            const payload = this.jwtService.verify(token,
                {
                    secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
                }
            );
            console.log("Check payload object in class JWT AUTH GUARD: ", payload)

            request ['user'] = payload; //user @Req() req to get payload.
        }catch{
           throw new UnauthorizedException();
        }
        return true;


        //2. second way to verify Token. I use this in express.js 
        // try{ 
        //     const decodedJwtToken = await this.jwtService.verify(token);
        //     request.user = decodedJwtToken;
        //     console.log("Result of jwt verify method in auth guard class", decodedJwtToken);
        // }
        // catch{
        //     throw new UnauthorizedException();
        // }
        
    }

    // extract token from authorization header if you use local storage to save token
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }


    
}

//this class used to customize the authentication and authorization
//so I don't need passport strategy


//src: https://docs.nestjs.com/security/authentication