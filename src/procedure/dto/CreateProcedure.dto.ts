import { ApiProperty } from "@nestjs/swagger";
import { ProcedureType } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProcedureDto {
  @ApiProperty({ example: "Surgery" })
  @IsString()
  procedureName: string;

  @ApiProperty({ enum: ProcedureType })
  @IsEnum(ProcedureType)
  type: ProcedureType;

  @ApiProperty({ example: 250 })
  @IsNumber()
  cost: number;

  @ApiProperty({ example: "Removal of smth " })
  @IsOptional()
  @IsString()
  description?: string;
}
