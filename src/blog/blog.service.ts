import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogRepository } from "@/blog/repositories/blog.repository";
import { CreateBlogDto } from "@/blog/dto/CreateBlog.dto";
import { UpdateBlogDto } from "@/blog/dto/UpdateBlog.dto";
import { Transactional } from "@nestjs-cls/transactional";
import { BlogDto } from "@/blog/dto/Blog.dto";
import { toCamelCase } from "@/blog/toCamelCase";
import { toCamelCase as toCamelCaseUniversal } from "@/common/utils/toCamelCase";
import { UserService } from "@/user/user.service";

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly userService: UserService,
  ) {}

  @Transactional()
  async getAllBlogs() {
    const blogs = await this.blogRepository.getAll();
    return toCamelCaseUniversal(blogs) as unknown;
  }

  @Transactional()
  async searchBlogs(query: { title?: string }): Promise<BlogDto[]> {
    const blogs = await this.blogRepository.search(query.title);
    return blogs.map(toCamelCase);
  }

  @Transactional()
  async getBlogById(id: number): Promise<BlogDto> {
    const blog = await this.blogRepository.getById(id);
    if (!blog) {
      throw new NotFoundException("Blog by this id is not found");
    }

    return toCamelCase(blog);
  }

  @Transactional()
  async create({ userId, title, description }: CreateBlogDto): Promise<BlogDto> {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException("User not found");

    const blog = await this.blogRepository.create({ userId, title, description });
    return toCamelCase(blog);
  }

  @Transactional()
  async updateBlog({ id, description, title }: UpdateBlogDto & { id: number }): Promise<BlogDto> {
    const blog = await this.blogRepository.update({ title, description, id });
    if (!blog) throw new NotFoundException("Blog not found or cannot be updated");

    return toCamelCase(blog);
  }

  @Transactional()
  async deleteBlog(id: number): Promise<BlogDto> {
    const blog = await this.blogRepository.delete(id);
    /*  return {
      createdAt: blog.created_at,
      userId: blog.user_id,
      ...blog,
    }
*/
    return toCamelCase(blog);
  }
}
