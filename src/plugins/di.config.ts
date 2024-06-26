import { fastifyPlugin } from "fastify-plugin";
import { Lifetime, asClass, asValue } from "awilix";
import { FastifyPluginAsync } from "fastify";
import { fastifyDiPlugin } from "@inaiat/fastify-di-plugin";
import UserService from "../modules/user/user.service.js";
import UserController from "../modules/user/user.controller.js";
import { FastifyInstance } from "fastify/types/instance.js";
import AuthController from "../modules/auth/auth.controller.js";
import { PrismaClient } from "@prisma/client";
import { Env, appConfig } from "../config/app.config.js";
import {
  NodeMailerEnv,
  nodeMailerConfig,
} from "../config/nodemailer.config.js";
import DashboardController from "../modules/dashboard/dashboard.controller.js";
import autoBind from "auto-bind";
import AdminController from "../modules/admin/admin.controller.js";

declare module "@inaiat/fastify-di-plugin" {
  interface Cradle {
    readonly appconfig: Env;
    readonly nodeMailerConfig: NodeMailerEnv;
    readonly userServices: UserService;
    readonly userControlleres: UserController;
    readonly authControlleres: AuthController;
    readonly adminControlleres: AdminController;
    readonly dashboardControlleres: DashboardController;
    readonly prisma: PrismaClient;
    readonly server: FastifyInstance;
    readonly autoBind: any;
  }
}

export default fastifyPlugin<FastifyPluginAsync>(
  async (fastify) => {
    const prisma = new PrismaClient();
    await fastify.register(fastifyDiPlugin, {
      module: {
        // user
        userServices: asClass(UserService, { lifetime: Lifetime.SINGLETON }),
        userControlleres: asClass(UserController, {
          lifetime: Lifetime.SINGLETON,
        }),
        // admin
        adminControlleres: asClass(AdminController, {
          lifetime: Lifetime.SINGLETON,
        }),
        // auth
        authControlleres: asClass(AuthController, {
          lifetime: Lifetime.SINGLETON,
        }),
        // dashboard
        dashboardControlleres: asClass(DashboardController, {
          lifetime: Lifetime.SINGLETON,
        }),

        prisma: asValue(prisma),
        server: asValue(fastify),
        autoBind: asValue(autoBind),
        appconfig: asValue(appConfig()),
        nodeMailerConfig: asValue(nodeMailerConfig()),
      },
      injectionMode: "CLASSIC",
    });
  },
  { name: "di.config" }
);
