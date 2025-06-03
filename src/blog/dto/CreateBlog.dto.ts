import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class CreateBlogDto {
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

  @ApiProperty({ example: 1, description: "Id of the useR(owner) to link blog with" })
  @IsInt()
  @IsNotEmpty({ message: "Id is required" })
  userId: number;
}
