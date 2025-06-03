import { Permissions } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class CreateAdministrationDto {
  @ApiProperty({
    example: Permissions.FULL_ACCESS,
    enum: Permissions,
    description: "Permission level for administrator",
  })
  @IsEnum(Permissions)
  permissions: Permissions;
}
