import "reflect-metadata";
// import { DataSource } from "typeorm";
// import { User /*, UserTypeDefs*/ } from "./enitities/User";
import { ApolloServer } from "apollo-server-express";
import express from "express";
// import { typeDefs } from "./typeDefs";
import { UserResolver } from "./resolvers/user";
import { MessageResolver } from "./resolvers/message";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { __prod__ } from "./constants";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./DataSource";
import { Server } from "socket.io";
import { GroupResolver } from "./resolvers/group";
import { ChannelResolver } from "./resolvers/channel";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

const main = async () => {
  // const AppDataSource = new DataSource({
  //   type: "mariadb",
  //   host: "localhost",
  //   port: 3306,
  //   username: "mysql",
  //   password: "mysql",
  //   database: "discord_clone2",
  //   entities: [User],
  //   synchronize: true,
  //   logging: true,
  // });

  await AppDataSource.initialize();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.set("trust proxy", 1);

  const appSession = session({
    name: "qid",
    store: new RedisStore({
      client: redis,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 3600 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: "lax", // csrf
      secure: __prod__,
    },
    saveUninitialized: false,
    secret: "nadjkfmasdlfkmf",
    resave: false,
  });

  app.use(appSession);

  const apolloServer = new ApolloServer({
    // typeDefs: [UserTypeDefs],
    // resolvers: [UserResolver],
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        MessageResolver,
        GroupResolver,
        ChannelResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
    }),
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
    ],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
  });

  const server = app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
  });

  io.on("connection", socket => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("received", () => {
      console.log("received a message in index.ts");
      io.sockets.emit("received");
    });
  });

  /*
  const user = new User();
  user.username = "tim";

  await AppDataSource.manager.save(user);
  console.log("Photo has been saved. Photo id is", user.id);
  
  const savedPhotos = await AppDataSource.manager.findBy(User, {
    email: "tim@tim.com",
  });
  console.log("All photos from the db: ", savedPhotos);
  */
};

main();
