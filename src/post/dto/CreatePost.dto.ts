import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ example: "Proper nutrition for dogs", description: "Title of the post" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "A short summary", description: "Short post description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: "Full content here...", description: "Main content of the post" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1, description: "ID of the blog" })
  @IsInt()
  @Min(1)
  blogId: number;

  @ApiProperty({ example: 1, description: "ID of the user" })
  @IsInt()
  @Min(1)
  userId: number;
}
