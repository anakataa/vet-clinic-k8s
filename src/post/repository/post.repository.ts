import { Injectable } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { Post } from "@prisma/client";
import { CreatePostDto } from "../dto/CreatedPost.dto";
import { UpdatePostDto } from "../dto/UpdatePost.dto";

@Injectable()
export class PostRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  async create({ userId, title, description, content, blogId }: CreatePostDto): Promise<Post> {
    const data = {
      title,
      description,
      content,
      user_id: userId,
      blog_id: blogId,
    };

    return this.txHost.tx.post.create({ data });
  }

  async findByBlog(blogId: number): Promise<Post[]> {
    return this.txHost.tx.post.findMany({
      where: { blog_id: blogId },
    });
  }
  async findLatest(): Promise<Post[]> {
    return this.txHost.tx.post.findMany({
      orderBy: { created_at: "desc" },
      take: 4,
      include: {
        blog: true,
      },
    });
  }

  async update({ id, title, description, content }: UpdatePostDto): Promise<Post> {
    const data = { title, description, content };

    return this.txHost.tx.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Post> {
    return this.txHost.tx.post.delete({
      where: { id },
    });
  }
}
