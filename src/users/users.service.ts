import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersEntity } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { encodePassword, verifyPassword } from 'src/utils/password.utils';
import { RolesService } from 'src/roles/roles.service';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name, { timestamp: true });

  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: Repository<UsersEntity>,
    @Inject("DATA_SOURCE") private readonly dataSource: DataSource,
    private readonly roleService: RolesService
  ) {}

  //Find user by email
  async isEmailAvailable(email: string): Promise<boolean> {

    this.logger.log(`is email available is hit with email: ${email}`);
    const user = await this.userRepository.findOneBy({
      email: email,
    });
    return user ? false : true;
  }

  //User registration
  async registerUser(createUserDto: CreateUserDto): Promise<UsersEntity>{
    this.logger.log('registerUser method is hit');

    const isEmailFound = await this.isEmailAvailable(createUserDto.email);

    if(!isEmailFound){
      this.logger.error('There is double email existing in the database');
      throw new ConflictException('Email has been registered.'); //TODO: CHANGE THE MESSAGE
    }

    const roles = await this.roleService.findRoleByRoleName(UserRole.GUEST);
    this.logger.log(`Retrieved roles name: ${roles.roleName}`);

    if(roles == null){
      this.logger.error('Roles not found');
      throw new NotFoundException('Roles Not found');
    }

    const user = new UsersEntity();
    user.email = createUserDto.email;
    user.password = await encodePassword(createUserDto.password);
    user.roles = [roles];

    const createdUser = this.userRepository.create(user);

    const saveUser = await this.userRepository.save(createdUser);
    this.logger.log(`Saved user is... ${saveUser.email}`)
    
    return saveUser;
  }

  //Login or authenticate by finding one user by email
  async Login(email: string, password: string): Promise<UsersEntity> {

    const user = await this.userRepository.findOne({
      where: {email},
      relations: ['roles']
    })

    if (!user) {
      this.logger.error("User has not been registered");
      throw new NotFoundException("User has not been registered or email is wrong");
    }
    const matchedPassword = await verifyPassword(password, user.password);

    if (matchedPassword) {
      this.logger.log("Password is matched users can login");
      return user;
    } else {
      throw new BadRequestException('Password is not match');
    }
  }


  async findUserByEmail(email: string): Promise<UsersEntity>{

    const firstUser = await this.dataSource
    .getRepository(UsersEntity)
    .createQueryBuilder("user")
    .where("user.email = :email", { email: email })
    .getOne();

    return firstUser;
  }


  //FInd All users
  async findAllUser(): Promise<UsersEntity[]>{
    this.logger.log('Find all user method got hit');
    const users =  this.userRepository.find();
    if(users == null){
      throw new NotFoundException('users not found')
    }
    return users;
  }
}
