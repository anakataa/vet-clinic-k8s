import { Body, Controller, Post as HttpPost, Get, Put, Delete, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/CreatedPost.dto";
import { UpdatePostDto } from "./dto/UpdatePost.dto";
import { Roles } from "@/common/decorators/roles.decorator";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { Role } from "@prisma/client";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Post")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @HttpPost()
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new post" })
  @ApiResponse({ status: 201, description: "Post created successfully" })
  async createPost(@Body() dto: CreatePostDto) {
    return await this.postService.createPost(dto);
  }

  @Get("latest")
  @ApiOperation({ summary: "Get the latest posts" })
  @ApiResponse({ status: 200, description: "List of latest posts" })
  async getLatest() {
    return await this.postService.getLatestPosts();
  }

  @Get("blog/:blogId")
  @ApiOperation({ summary: "Get all posts from a blog" })
  @ApiResponse({ status: 200, description: "List of posts from specified blog" })
  async getPostsByBlog(@Param("blogId", ParseIntPipe) blogId: number) {
    return await this.postService.getPostsByBlog(blogId);
  }

  @Put(":id")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update post by ID" })
  @ApiResponse({ status: 200, description: "Post updated successfully" })
  async updatePost(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return await this.postService.updatePost({ ...dto, id });
  }

  @Delete(":id")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete post by ID" })
  @ApiResponse({ status: 200, description: "Post deleted successfully" })
  async deletePost(@Param("id", ParseIntPipe) id: number) {
    return await this.postService.deletePost(id);
  }
}
