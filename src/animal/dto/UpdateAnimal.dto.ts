import { ApiProperty } from "@nestjs/swagger";
import { Gender, Species } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateAnimalDto {
  @ApiProperty({ example: "Buddy", description: "Add animal name", required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: "GOLDEN_RETRIEVER", description: "Breef of the animal", required: false })
  @IsString()
  @IsOptional()
  breed: string;

  @ApiProperty({ example: 1, description: "Age in years", required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  age: number;

  @ApiProperty({ example: "DOG", enum: Species, description: "Animal species", required: false })
  @IsEnum(Species)
  @IsOptional()
  species: Species;

  @ApiProperty({ example: "MALE", enum: Gender, description: "Animal gender", required: false })
  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;
}
