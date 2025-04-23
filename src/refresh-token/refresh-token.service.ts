import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersEntity } from 'src/users/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class RefreshTokenService {
  private logger = new Logger(RefreshTokenService.name);

    constructor(
      @Inject("DATA_SOURCE") private readonly dataSource: DataSource,
      @Inject("REFRESH_TOKEN_REPOSITORY") private refreshTokenRepository: Repository<RefreshTokenEntity>
    ){}


    //REFRESH TOKEN SERVICE - SAVE REFRESH TOKEN    
    async saveRefreshToken(token: string, user: UsersEntity): Promise<RefreshTokenEntity> {

      this.logger.debug(`User email when user is going to be saved in refresh token table ${user.email}`);
      
      try{
        const newUser = new UsersEntity();
        newUser.id = user.id;
        newUser.email = user.email;

        const refreshToken = this.refreshTokenRepository.create({
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          user: newUser
        });
    
        const savedRefreshToken = await this.refreshTokenRepository.save(refreshToken, {reload: true});
        this.logger.log("Saved refresh token:", savedRefreshToken);

        return savedRefreshToken;

      }catch(error){
        if(error instanceof Error){
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: "Error when saving refresh token into database"
          }, HttpStatus.BAD_REQUEST, {
            cause: error.message
          })
        }
      }
    }


    //REFRESH TOKEN SERVICE - FIND REFRESH TOKEN BY TOKEN
    async findRefreshTokenByToken(token: string): Promise<RefreshTokenEntity>{
      this.logger.log("findRefreshTokenByToken method is called");
      try{
        const refreshToken = await this.refreshTokenRepository.findOne({
            where: {token}
        });

        if(!refreshToken){
            throw new NotFoundException("Token not found");
        }

        return refreshToken;

      }catch(error){
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: "Refresh Token not found in database"
        }, HttpStatus.NOT_FOUND, {
          cause: error.message,
        })
      }
    }


    //REFRESH TOKEN SERVICE - FIND REFRESH TOKEN BY ID
    async findRefreshTokenById(id: number): Promise<RefreshTokenEntity>{
        
        this.logger.log('Find Refresh Token By Token Method is hit');

        try {
        const refreshToken = this.refreshTokenRepository
        .createQueryBuilder('rt')
        .innerJoinAndSelect('rt.user', 'user')
        .where('rt.id = :id', { id })
        .select([
            'rt.id',
            'rt.token',
            'user.id',
            'user.email',
            'user.username'
        ])
        .getOne();
    
        console.log("Find Refresh Token By Token Method [Refresh Token Service class] " + refreshToken);
        return refreshToken;
        } catch (error) {
            if(error instanceof Error){
                console.error("Log Error [findRefreshTokenById]: ", error);
                  throw new HttpException({
                    status: HttpStatus.NOT_FOUND,
                    message: error.message,
                    }, HttpStatus.NOT_FOUND, {
                      cause: error,
                    });
            }}
    }



    //REFRESH TOKEN SERVICE - VALIDATE REFRESH TOKEN AND PROVING THAT THIS BELONGS TO ONE USER
    async validateRefreshToken(token: string, userId: number): Promise<RefreshTokenEntity>{
        console.log("Find one token method in Refresh Token Class is hit!");

        try{
        const oneRefreshToken = await this.refreshTokenRepository.findOne({
          where:{ user: {id: userId}, token: token},
        	relations: {user: true}
        });
        
        if(!oneRefreshToken){
            throw new UnauthorizedException("Invalid Token");
        }

        if(oneRefreshToken.isRevoked == true){
            console.log("Token is revoked")
            throw new UnauthorizedException("Token is revoked");
        }

        if(oneRefreshToken.expiresAt < new Date()){
            throw new UnauthorizedException("Refresh token has expired");
        }

        return oneRefreshToken;

      }catch(error){
        throw new HttpException({
          status: HttpStatus.UNAUTHORIZED,
          error: "User not authorized to hit this endpoint"
        }, HttpStatus.UNAUTHORIZED, {
          cause: error
        })
      }
    }


    //REFRESH TOKEN SERVICE - UPDATE REFRESH TOKEN TO BE REVOKED
    async updateRefreshTokenToBeRevoked(token: string, userId: number): Promise<boolean>{
        this.logger.log("Executing refresh token to be revoked");

        console.log("TOKEN in Update refresh token to be revoked [Refresh Token Service]: ", token);
        console.log("USER ID in Update refresh token to be revoked [Refresh Token Service]: ", userId);

        try{
        const results = await this.refreshTokenRepository
            .createQueryBuilder()
            .update(RefreshTokenEntity)
            .set({ isRevoked: true })
            .where("token = :token", { token: token })
            .andWhere("user_id = :userId", {userId: userId})
            .execute();
        
        return results.affected > 0;
        }catch(error){
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: "Token or user not found"
          }, HttpStatus.BAD_REQUEST, {
            cause: error
          })
        }
    }


    //REFRESH TOKEN SERVICE - FIND TOKEN BY IS REVOKE
    async findTokenByIsRevoke(isRevoked: boolean){
      this.logger.log("findTokenByIsRevoke method is called");

      try{
        const revokedToken = 
        await this.refreshTokenRepository
        .createQueryBuilder("rt")
        .leftJoinAndSelect("rt.user", "u")
        .where("rt.is_revoked = :isRevoked", { isRevoked })
        .select([
            "u.id", "user_id",
            "u.email", "user_email",
            "u.username", "username",
            "rt.token", "user_token",
            "rt.expires_at", "expires_at"
        ])
        .getRawMany();
        return revokedToken;
      }catch(error){
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: "Token already updated to be revoked"
        }, HttpStatus.BAD_REQUEST, {
          cause: error
        })
      }
    }

    //REFRESH TOKEN SERVICE - DELETE REFRESH TOKEN BY TOKEN ID
    async deleteRefreshTokenById(userId: number): Promise<void>{
        await this.refreshTokenRepository.delete( {user: {id: userId}} );
    }
}
