import { Post } from "@prisma/client";
import { PostDto } from "./dto/Post.dto";

export function toCamelCase(post: Post): PostDto {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    content: post.content,
    userId: post.user_id,
    blogId: post.blog_id,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
}
