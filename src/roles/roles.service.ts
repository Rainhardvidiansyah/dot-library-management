import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RolesEntity } from './entities/roles.entity';

@Injectable()
export class RolesService {

  private logger = new Logger(RolesService.name, {timestamp: true});

  constructor(
    @Inject("DATA_SOURCE") private readonly dataSource: DataSource,
    @Inject("ROLES_REPOSITORY") private readonly rolesRepository: Repository<RolesEntity>){}



  async findRoleByRoleName(roleName: string): Promise<RolesEntity>{

    try{
    const role = await this
    .rolesRepository.createQueryBuilder("roles")
    .where("role_name = :roleName", {roleName: roleName})
    .getOneOrFail();

    return role;

    } catch(error){
      if (error instanceof Error) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: error.message,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
  }


  async findRolesByUsersId(userId: number): Promise<RolesEntity[]>{
    try {
      const rolesData = await this.dataSource
      .createQueryBuilder()
      .select('r.role_name', 'role_name')
      .from('user_roles', 'ur')
      .innerJoin('roles', 'r', 'ur.role_id = r.id')
      .innerJoin('users', 'u', 'ur.user_id = u.id')
      .where('u.id = :userId', { userId })
      .getRawMany();

      this.logger.debug(rolesData);

      return rolesData;

    } catch (error) {
      if(error instanceof Error){
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          message: error.message
        },
      HttpStatus.BAD_REQUEST)
      }
    }
  }

  findAll() {
    return `This action returns all rolesModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolesModule`;
  }
}
