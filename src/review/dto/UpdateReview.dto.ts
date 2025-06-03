import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateReviewDto {
  @ApiProperty({
    example: "Updated comment on the product",
    description: "Write the updated comment of the review",
    required: false,
  })
  @IsOptional()
  comment?: string;

  @ApiProperty({
    example: 1,
    description: "Rating of the product (1-5)",
    minimum: 1,
    maximum: 5,
    type: Number,
    required: false,
  })
  @Max(5, {
    message: "Rating must be at most 5",
  })
  @Min(1, {
    message: "Rating must be at least 1",
  })
  @IsOptional()
  @IsNumber()
  rating?: number;
}
