import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PostEntity } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Prisma } from '@prisma/client';
import { NotFoundError } from '../../common/erros/types/NotFoundError';
@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { authorEmail } = createPostDto;

    delete createPostDto.authorEmail;
    const user = await this.prisma.user.findUnique({
      where: { email: authorEmail },
    });

    if (!user) {
      throw new NotFoundError('Usuario não existe');
    }

    const data: Prisma.PostCreateInput = {
      ...createPostDto,
      author: {
        connect: {
          email: authorEmail,
        },
      },
    };

    return this.prisma.post.create({
      data,
    });
  }

  async findAll(): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const { authorEmail } = updatePostDto;
    if (!authorEmail) {
      return this.prisma.post.update({
        where: { id: id },
        data: updatePostDto,
      });
    }
    delete updatePostDto.authorEmail;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email: authorEmail,
      },
    });

    if (!existUser) {
      throw new NotFoundError('Autor não existe');
    }

    const data: Prisma.PostUpdateInput = {
      ...updatePostDto,
      author: {
        connect: {
          email: authorEmail,
        },
      },
    };
    return this.prisma.post.update({
      where: { id: id },
      data: data,
      include: {
        author: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.post.delete({
      where: { id: id },
    });
  }
}
