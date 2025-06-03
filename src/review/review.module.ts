import { Module } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";
import { ReviewRepository } from "./repositories/review.repository";
import { UserModule } from "@/user/user.module";

@Module({
  imports: [UserModule],
  providers: [ReviewService, ReviewRepository],
  controllers: [ReviewController],
})
export class ReviewModule {}
