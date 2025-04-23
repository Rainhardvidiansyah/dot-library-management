import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateAuthorDto } from "src/authors/dto/create-author.dto";


export class CreateBookDto{

  @ApiProperty({
      example: 'The Effective Go',
      required: true
    })
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  publisher?:string;

  @ApiProperty({
    example: 10,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number

  @ApiProperty({
    example: 2019,
    required: true
  })
  @IsNotEmpty()
  publishedYear: number;


  @ApiProperty({
    example: [{'authorName': 'Richard'}, {'authorName': 'John Doe'}, 'or using one object/json only'],
    required: true
  })
  @ValidateNested({each: true})
  @Type(() => CreateAuthorDto)
  authors: CreateAuthorDto[]


}