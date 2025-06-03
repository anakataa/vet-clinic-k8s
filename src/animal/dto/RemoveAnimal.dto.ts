import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class RemoveAnimalDto {
  @ApiProperty({ example: 1, description: "Id of the user who owns the animal" })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 1, description: "Id of the animal to remove" })
  @IsInt()
  @Min(1)
  animalId: number;
}
