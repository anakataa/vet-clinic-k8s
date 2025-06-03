import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@/common/guards/Auth.guard";
import { CreateReviewDto } from "./dto/CreateReview.dto";
import { UpdateReviewDto } from "./dto/UpdateReview.dto";
import { GetUser } from "@/common/decorators/get-user.decorator";
import { Role, User } from "@prisma/client";
import { RoleGuard } from "@/common/guards/Roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";

@ApiTags("Review")
@ApiBearerAuth("access-token")
@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Create a new review" })
  @ApiResponse({ status: 201, description: "Review created successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async createReview(@GetUser() user: User, @Body() data: CreateReviewDto) {
    return this.reviewService.createReview(user.id, data);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Update a review by ID" })
  @ApiResponse({ status: 200, description: "Review updated successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async updateReview(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateReviewDto) {
    return this.reviewService.updateReview(id, data);
  }

  @Get("")
  @ApiOperation({ summary: "Get all reviews" })
  @ApiResponse({ status: 200, description: "List of all reviews" })
  async getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a review by ID" })
  @ApiResponse({ status: 200, description: "Review found" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async getReviewById(@Param("id") id: number) {
    return this.reviewService.getReviewById(id);
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "Get review by user ID" })
  @ApiResponse({ status: 200, description: "User review" })
  @ApiResponse({ status: 404, description: "User not found or no reviews" })
  async getReviewByUserId(@Param("userId") userId: number) {
    return this.reviewService.getReviewByUserId(userId);
  }

  @Delete("mine")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Delete the user's review" })
  @ApiResponse({ status: 200, description: "Review deleted successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async deleteMyReview(@GetUser() user: User) {
    return this.reviewService.deleteReview(user.id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Delete a review by ID" })
  @ApiResponse({ status: 200, description: "Review deleted successfully" })
  @ApiResponse({ status: 404, description: "Review not found" })
  async deleteReview(@Param("id", ParseIntPipe) id: number) {
    return this.reviewService.deleteReview(id);
  }
}
