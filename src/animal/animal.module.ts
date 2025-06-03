import { Module } from "@nestjs/common";
import { AnimalService } from "./animal.service";
import { AnimalController } from "./animal.controller";
import { AnimalRepository } from "./repositories/animal.repository";
import { AuthModule } from "@/auth/auth.module";
import { UserModule } from "@/user/user.module";

@Module({
  imports: [AuthModule, UserModule],
  providers: [AnimalService, AnimalRepository],
  controllers: [AnimalController],
  exports: [AnimalService],
})
export class AnimalModule {}
