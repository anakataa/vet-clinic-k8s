import { forwardRef, Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostRepository } from "./repository/post.repository";
import { BlogModule } from "@/blog/blog.module";

@Module({
  imports: [forwardRef(() => BlogModule)],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
