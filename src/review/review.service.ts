import { UserService } from "@/user/user.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ReviewRepository } from "./repositories/review.repository";
import { toCamelCase } from "@/common/utils/toCamelCase";
import { ReviewDto } from "./dto/Review.dto";
import { CreateReviewDto } from "./dto/CreateReview.dto";
import { UpdateReviewDto } from "./dto/UpdateReview.dto";

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userService: UserService,
  ) {}

  async getAllReviews() {
    const reviews = await this.reviewRepository.getAll();
    return toCamelCase(reviews) as ReviewDto[];
  }

  async createReview(id: number, data: CreateReviewDto) {
    const review = await this.reviewRepository.create({
      rating: data.rating,
      comment: data.comment,
      user: { connect: { id } },
    });
    return toCamelCase(review) as ReviewDto;
  }

  async getReviewById(id: number) {
    const review = await this.reviewRepository.getById(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return toCamelCase(review) as ReviewDto;
  }

  async getReviewByUserId(userId: number) {
    const reviews = await this.reviewRepository.getByUserId(userId);
    return toCamelCase(reviews) as ReviewDto;
  }

  async updateReview(id: number, data: UpdateReviewDto) {
    const review = await this.reviewRepository.update(
      {
        rating: data.rating,
        comment: data.comment,
      },
      id,
    );
    return toCamelCase(review) as ReviewDto;
  }

  async deleteReview(id: number) {
    const review = await this.reviewRepository.delete(id);
    return toCamelCase(review) as ReviewDto;
  }
}
