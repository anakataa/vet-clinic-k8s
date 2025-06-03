import { ClsModule } from "nestjs-cls";
import { JwtModule } from "@nestjs/jwt";
import { ClsPluginTransactional } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { CommonModule } from "../common.module";
import { PrismaService } from "../datasource/Prisma.Service";

export const jwtModule = JwtModule.registerAsync({
  global: true,
  useFactory: () => {
    return {
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d", mutatePayload: false },
    };
  },
});

export const clsModule = ClsModule.forRoot({
  plugins: [
    new ClsPluginTransactional({
      imports: [CommonModule],
      adapter: new TransactionalAdapterPrisma<PrismaService>({
        prismaInjectionToken: PrismaService,
        defaultTxOptions: { isolationLevel: "ReadCommitted" },
      }),
    }),
  ],
});
