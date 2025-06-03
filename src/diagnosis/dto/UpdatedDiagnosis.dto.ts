import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateDiagnosisDto {
  @ApiPropertyOptional({ example: "Updated diagnosis description", description: "New diagnosis description" })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: "Diagnosis description must be at least 10 characters long" })
  diagnosisDescription?: string;

  @ApiPropertyOptional({ example: "Updated treatment plan", description: "New treatment" })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: "Treatment must be at least 5 characters long" })
  treatment?: string;
}
