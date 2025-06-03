import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "@/user/user.module";
import { EmailModule } from "@/email/email.module";
import { AuthController } from "./auth.controller";
import { jwtModule } from "@/common/utils/globalModules";

@Module({
  imports: [UserModule, jwtModule, forwardRef(() => EmailModule)],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
