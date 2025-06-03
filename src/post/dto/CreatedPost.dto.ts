import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt, Min } from "class-validator";

export class CreatePostDto {
  @ApiProperty({ example: "Proper nutrition for dogs", description: "Title of the post" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "Short summary of the post", description: "Post description" })
  @IsString()
  description: string;

  @ApiProperty({ example: "Full content of the post...", description: "Main content" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1, description: "ID of the blog to which the post belongs" })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  blogId: number;

  @ApiProperty({ example: 2, description: "ID of the user creating the post" })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  userId: number;
}
