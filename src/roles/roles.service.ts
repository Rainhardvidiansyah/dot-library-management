import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
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


  async findRolesByUsersId(userId: number){
    try {

    /*
    SELECT 
    r.role_name AS role_name
    FROM roles r
    JOIN user_roles ur on r.id = ur.role_id
    JOIN users u ON u.id = ur.user_id
    WHERE u.id = ?;
    */
    const rolesData = await this
    .dataSource
    .createQueryBuilder()
    .select('r.role_name', 'role_name')
    .from('roles', 'r')
    .innerJoin('user_roles', 'ur', 'r.id = ur.role_id')
    .innerJoin('users', 'u', 'u.id = ur.user_id')
    .where('u.id = :userId', { userId })
    .getRawMany();
    
    
    this.logger.debug(`ROLES DATA: ${rolesData}`);

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
