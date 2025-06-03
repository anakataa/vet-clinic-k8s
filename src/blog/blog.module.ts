import { forwardRef, Module } from "@nestjs/common";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";
import { BlogRepository } from "./repositories/blog.repository";
import { UserModule } from "@/user/user.module";
import { PostModule } from "@/post/post.module";

@Module({
  imports: [UserModule, forwardRef(() => PostModule)],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
  exports: [BlogService],
})
export class BlogModule {}
