import { Body, Controller, Delete, Get, Logger, NotFoundException, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesService } from 'src/roles/roles.service';

@ApiTags('AUTHENTICATION')
@ApiBearerAuth("access_token")
@Controller('api/v1/authentication')
export class AuthenticationController {

  private logger = new Logger(AuthenticationController.name, {timestamp: true});

  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthenticationService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly roleService: RolesService

  ){}

  //REGISTRATION
  @ApiResponse({ status: 201, description: 'The user data has been successfully created.'})
  @ApiBody({
     type: CreateUserDto,
     description: 'Json structure for User object',
  })
  @Public()
  @Post('registration')
  async registerUser(@Body() createUserDto: CreateUserDto){

    this.logger.log('Register user controller is hit');
    return this.userService.registerUser(createUserDto);
  }


  //SECOND LOGIN METHOD
  @ApiResponse({ status: 201, description: 'The user data has been successfully created.'})
  @ApiBody({
     type: LoginRequestDto,
     description: 'Json structure for User object when trying to login',
  })
  @Public()
  @Post('validate')
  async authenticateUser(@Body()req: LoginRequestDto, @Res() res){

    const user = await this.authService.validateUsers(req.email, req.password);

    if(!user){
      throw new NotFoundException("User doesn't exist");
    }

    const rolesData = await this.roleService.findRolesByUsersId(user.id);
    const roleName = rolesData.map(a => a.role_name);

    const token = await this.authService.generateToken(user.id, user.email, roleName);
    this.logger.log(`Access token ${token.access_token}`);


    const refreshToken = await this.authService.generateRefreshToken(user.id, user.email, roleName);

    await this.refreshTokenService.saveRefreshToken(refreshToken.refresh_token, user);

    res.cookie('refresh_token', refreshToken.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .status(200)
    .json({
      Message: 'user is successfully logged in',
      data: {email: user.email, roles: roleName},
      Token: token.access_token
    })
  }

  //GENERATE NEW TOKEN
  @Public()
  @Get('refresh-token')
  async verifyAndGenerateNewToken(@Req() req, @Res() res){

    const token = req.cookies?.refresh_token;

    if(!token){
        throw new UnauthorizedException("Token not found");
    }

    try{
    const decodedToken = await this.authService.decodeToken(token);

    const userId = decodedToken.id;
    const validateToken = await this.refreshTokenService.validateRefreshToken(token, userId);
    const role = decodedToken.role;
    console.warn(`ROLE DECODED TOKEN: ${role}`)
   
    
    const newAccessToken = await this.authService
                          .generateToken(
                          validateToken.user.id,
                          validateToken.user.email,
                          role);


    res.status(200).json({
      "New access token": newAccessToken.access_token
    });
    }catch(error){
      console.error(error.message);
        throw new UnauthorizedException("Your session has been expired. Please login again.");
    }
  }

  //LOGOUT
  @ApiResponse({status: 200, description: 'User just logged out'})
  @Delete('logout')
  async logout(@Req() req, @Res() res){
    this.logger.warn(`User is trying to logout`);
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
        throw new UnauthorizedException("No refresh token found");
    }

    const decodedToken = await this.authService.decodeToken(refreshToken);
    const userId = decodedToken.id;

    await this.refreshTokenService.updateRefreshTokenToBeRevoked(refreshToken, userId);
    console.log(refreshToken + " deleted");

    res.clearCookie("refresh_token");

    res.status(200).json({
        message: "user just logged out",
    })
  }


  @Get()
  @Roles('ADMIN')
  async getData(){
    return this.userService.findAllUser();
  }

  @Get('librarian')
  @Roles('LIBRARIAN')
  async librarianResource(@User() user){
    this.logger.log('librarian Resource method is hit');
    this.logger.log(`User id: ${user.id}`);
    this.logger.log(`User email: ${user.email}`);
    return user;
  }


  @Get('member')
  @Roles('MEMBER')
  //@UseGuards(UserActiveGuard)
  async memberResource(@User() user){
    this.logger.log('Member Resource method is hit');
    this.logger.log(`User id: ${user.id}`);
    this.logger.log(`User email: ${user.email}`);
    return user;
  }

  @Get('admin-librarian')
  @Roles('ADMIN', 'LIBRARIAN')
  async librarianAndAdminResource(@User() user){
    this.logger.log(`Librarian and Admin resource is hit`);
    this.logger.log(`User email who accesses this resource ${user.email}`);
    return user;
  }
}
