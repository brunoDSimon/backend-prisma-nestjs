import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreatePostDto {
  @ApiProperty({
    description: 'Titulo para o post',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Conteudo do post',
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    description: 'author do post',
  })
  @IsEmail()
  authorEmail: string;
}
