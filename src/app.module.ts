import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailModule } from "./email/email.module";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { UserModule } from "./user/user.module";
import { CommonModule } from "./common/common.module";
import { clsModule, jwtModule } from "./common/utils/globalModules";
import { AnimalModule } from "./animal/animal.module";
import { BlogModule } from "@/blog/blog.module";
import { AppointmentRequestModule } from "./appointment-request/appointment-request.module";
import { TimeSlotModule } from "./time-slot/time-slot.module";
import { ScheduleModule } from "@nestjs/schedule";
import { PostModule } from "@/post/post.module";

import { AppointmentModule } from "./appointment/appointment.module";
import { ProcedureModule } from "./procedure/procedure.module";
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { ReviewModule } from './review/review.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    jwtModule,
    clsModule,
    CommonModule,
    AuthModule,
    EmailModule,
    UserModule,
    AnimalModule,
    BlogModule,
    AppointmentRequestModule,
    TimeSlotModule,
    AppointmentModule,
    ProcedureModule,
    DiagnosisModule,
    PostModule,
    ReviewModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
