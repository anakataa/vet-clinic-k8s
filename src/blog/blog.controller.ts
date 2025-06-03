import { CreateBlogDto } from "@/blog/dto/CreateBlog.dto";
import { BlogService } from "./blog.service";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { Body, Controller, Param, ParseIntPipe, Put, Delete, Post, UseGuards, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery } from "@nestjs/swagger";
import { Roles } from "@/common/decorators/roles.decorator";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Role } from "@prisma/client";
import { UpdateBlogDto } from "@/blog/dto/UpdateBlog.dto";

@ApiTags("Blog")
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Create a new blog" })
  @ApiResponse({ status: 201, description: "Blog created successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async createBlog(@Body() dto: CreateBlogDto) {
    return await this.blogService.create(dto);
  }

  @Get("")
  @ApiOperation({ summary: "get all blogs" })
  @ApiResponse({ status: 200, description: "List of all blogs" })
  async getAllBlogs() {
    return await this.blogService.getAllBlogs();
  }

  @Get("search")
  @ApiOperation({ summary: "Get specific blog by title" })
  @ApiResponse({ status: 200, description: "Blog(s) found" })
  @ApiResponse({ status: 404, description: "Blog not found" })
  @ApiQuery({ name: "title", required: false })
  async search(@Query("title") title?: string) {
    return await this.blogService.searchBlogs({ title });
  }

  @Put(":id")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update blog by ID" })
  @ApiResponse({ status: 200, description: "Blog updated successfully" })
  @ApiResponse({ status: 404, description: "Blog not found" })
  async updateBlog(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateBlogDto) {
    return await this.blogService.updateBlog({ ...dto, id });
  }
  @Delete(":id")
  @UseGuards(RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete blog by ID" })
  @ApiResponse({ status: 200, description: "Blog deleted successfully" })
  @ApiResponse({ status: 404, description: "Blog not found" })
  async deleteBlog(@Param("id", ParseIntPipe) id: number) {
    return await this.blogService.deleteBlog(id);
  }
}
