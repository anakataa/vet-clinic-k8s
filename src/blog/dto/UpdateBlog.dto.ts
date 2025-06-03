import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateBlogDto {
  @ApiProperty({ example: "Healthy eating", description: "Write the name of the blog" })
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @ApiProperty({
    example: "The influence of the right diet on the animals",
    description: "Write the description of the blog",
  })
  @IsString()
  @IsOptional()
  description?: string;
}
