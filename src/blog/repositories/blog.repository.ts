import { Injectable } from "@nestjs/common";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { CreateBlogDto } from "../dto/CreateBlog.dto";
import { Blog } from "@prisma/client";
import { TransactionHost } from "@nestjs-cls/transactional";
import { UpdateBlogDto } from "@/blog/dto/UpdateBlog.dto";

@Injectable()
export class BlogRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}
  public async create(dto: CreateBlogDto): Promise<Blog> {
    return await this.txHost.tx.blog.create({
      data: {
        title: dto.title,
        description: dto.description,
        user_id: dto.userId,
      },
    });
  }

  public async getAll(): Promise<Blog[]> {
    return await this.txHost.tx.blog.findMany({ include: { user: true } });
  }

  public async search(title?: string): Promise<Blog[]> {
    return await this.txHost.tx.blog.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
    });
  }

  public async update({ id, title, description }: UpdateBlogDto & { id: number }): Promise<Blog> {
    return await this.txHost.tx.blog.update({
      where: { id },
      data: {
        title,
        description,
      },
    });
  }

  public async delete(id: number): Promise<Blog> {
    return await this.txHost.tx.blog.delete({
      where: { id },
    });
  }

  public async getById(id: number): Promise<Blog | null> {
    return this.txHost.tx.blog.findUnique({ where: { id } });
  }
}
