import { Blog } from "@prisma/client";
import { BlogDto } from "@/blog/dto/Blog.dto";

export function toCamelCase(blog: Blog): BlogDto {
  return {
    id: blog.id,
    title: blog.title,
    description: blog.description,
    userId: blog.user_id,
    createdAt: blog.created_at,
    updatedAt: blog.updated_at,
  };
}
