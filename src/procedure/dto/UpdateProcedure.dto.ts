import { ApiProperty } from "@nestjs/swagger";
import { ProcedureType } from "@prisma/client";
import { IsString, IsEnum, IsNumber, IsOptional } from "class-validator";

export class UpdateProcedureDto {
  @ApiProperty({ example: "Surgery" })
  @IsOptional()
  @IsString()
  procedureName?: string;

  @ApiProperty({ enum: ProcedureType })
  @IsOptional()
  @IsEnum(ProcedureType)
  type?: ProcedureType;

  @ApiProperty({ example: 250 })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({ example: "Removal of smth " })
  @IsOptional()
  @IsString()
  description?: string;
}
