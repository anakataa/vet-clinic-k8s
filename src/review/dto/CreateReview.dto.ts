import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, Min, Max } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({
    example: "Amazing product!",
    description: "Write the comment of the review",
  })
  @IsString()
  @IsNotEmpty({ message: "Comment is required" })
  comment: string;

  @ApiProperty({
    example: 5,
    description: "Rating of the product (1-5)",
    minimum: 1,
    maximum: 5,
    type: Number,
    required: true,
    default: 5,
  })
  @IsNumber()
  @Min(1, { message: "Rating must be at least 1" })
  @Max(5, { message: "Rating must be at most 5" })
  @IsNotEmpty({ message: "Ratingß is required" })
  rating: number;
}
