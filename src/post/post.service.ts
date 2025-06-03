import { Injectable } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import { PostRepository } from "./repository/post.repository";
import { CreatePostDto } from "./dto/CreatedPost.dto";
import { UpdatePostDto } from "./dto/UpdatePost.dto";
import { toCamelCase } from "./toCamelCase";
import { NotFoundException } from "@nestjs/common";
import { BlogService } from "@/blog/blog.service";

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogService: BlogService,
  ) {}

  @Transactional()
  async createPost({ userId, title, description, content, blogId }: CreatePostDto) {
    const blog = await this.blogService.getBlogById(blogId);
    if (!blog) throw new NotFoundException("Blog not found");

    const post = await this.postRepository.create({ userId, title, blogId, content, description });
    return toCamelCase(post);
  }

  @Transactional()
  async getPostsByBlog(blogId: number) {
    const posts = await this.postRepository.findByBlog(blogId);
    return posts.map(toCamelCase);
  }

  @Transactional()
  async updatePost({ title, description, id, content }: UpdatePostDto) {
    const updated = await this.postRepository.update({ title, description, id, content });
    return toCamelCase(updated);
  }

  @Transactional()
  async deletePost(id: number) {
    const deleted = await this.postRepository.delete(id);
    return toCamelCase(deleted);
  }

  @Transactional()
  async getLatestPosts() {
    const posts = await this.postRepository.findLatest();
    return posts.map(toCamelCase);
  }
}
