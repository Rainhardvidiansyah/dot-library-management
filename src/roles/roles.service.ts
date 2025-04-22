import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RolesEntity } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(@Inject("ROLES_REPOSITORY") private readonly rolesRepository: Repository<RolesEntity>){}



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

  findAll() {
    return `This action returns all rolesModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rolesModule`;
  }
}
