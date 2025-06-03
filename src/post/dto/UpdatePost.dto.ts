import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from "class-validator";

export class UpdatePostDto {
  @ApiProperty({ example: "Updated title", description: "Title of the post" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: "Updated short description", description: "Optional post description" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: "Updated full content", description: "Main content of the post" })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 5, description: "ID of the post to update" })
  @IsInt()
  @Min(1)
  id: number;
}
