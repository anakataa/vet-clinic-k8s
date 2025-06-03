import { ApiProperty } from "@nestjs/swagger";
import { Gender, Species } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateAndAddAnimalDto {
  @ApiProperty({ example: "Buddy", description: "Add animal name" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "GOLDEN_RETRIEVER", description: "Breed of the animal" })
  @IsString()
  @IsNotEmpty()
  breed: string;

  @ApiProperty({ example: 1, description: "Age in years" })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ example: "DOG", enum: Species, description: "Animal species" })
  @IsEnum(Species)
  species: Species;

  @ApiProperty({ example: "MALE", enum: Gender, description: "Animal gender" })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 1, description: "Id of the useR(owner) to link animal with" })
  @IsInt()
  userId: number;
}
