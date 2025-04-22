import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('USERS')
@Controller('users')
export class UsersController {}
