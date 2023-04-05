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
require("dotenv").config();
import fileUpload, { UploadedFile } from "express-fileupload";
import sharp from "sharp";
import AWS from "aws-sdk";
import { v4 } from "uuid";
import cors from "cors";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

// declare global {
//   namespace Express {
//     interface Request {
//       files: {
//         image: {
//           name: string;
//           data: Buffer;
//           size: number;
//           encoding: string;
//           tempFilePath: string;
//           truncated: boolean;
//           mimetype: string;
//           md5: string;
//         };
//       };
//     }
//   }
// }

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
    secret: process.env.COOKIE_SECRET as string,
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
      redis,
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
    // console.log("a user connected");

    socket.on("disconnect", () => {
      // console.log("user disconnected");
    });

    socket.on("received", () => {
      // console.log("received a message in index.ts");
      io.sockets.emit("received");
    });

    socket.on("channel created", () => {
      io.sockets.emit("channel created");
    });

    socket.on("channel renamed", () => {
      io.sockets.emit("channel renamed");
    });

    socket.on("channel deleted", () => {
      io.sockets.emit("channel deleted");
    });

    socket.on("group renamed", () => {
      io.sockets.emit("group renamed");
    });

    socket.on("group deleted", () => {
      io.sockets.emit("group deleted");
    });

    socket.on("group left", () => {
      io.sockets.emit("group left");
    });

    socket.on("group joined", () => {
      io.sockets.emit("group joined");
    });

    socket.on("friend added", () => {
      io.sockets.emit("friend added");
    });

    socket.on("friend removed", () => {
      io.sockets.emit("friend removed");
    });
  });

  // image upload service
  app.use(
    fileUpload({
      limits: {
        fileSize: 10485760,
      },
      abortOnLimit: true,
    })
  );

  app.post(
    "/upload",
    cors({
      origin: [process.env.DOMAIN!],
      credentials: true,
    }),
    async (req, res) => {
      console.log(req.files);
      if (req.files && req.files.image) {
        const image = req.files.image as UploadedFile;

        // If no image submitted, exit
        if (!image) return res.sendStatus(400);

        // If does not have image mime type prevent from uploading
        if (!/^image/.test(image.mimetype)) return res.sendStatus(400);

        const imageSharp = sharp(image.data);
        let metadata;
        try {
          metadata = await imageSharp.metadata();
        } catch {
          return res.sendStatus(400);
        }

        // console.log(metadata);

        if (metadata.width! > 1000) {
          image.data = await sharp(image.data)
            .resize({ width: 1000 })
            .toBuffer();
          // .toFile("output.jpg", function (err) {
          //   // output.jpg is a 300 pixels wide and 200 pixels high image
          //   // containing a scaled and cropped version of input.jpg
          // });
        }
        if (metadata.height! > 1000) {
          image.data = await sharp(image.data)
            .resize({ height: 1000 })
            .toBuffer();
          // .toFile("output.jpg", function (err) {
          //   // output.jpg is a 300 pixels wide and 200 pixels high image
          //   // containing a scaled and cropped version of input.jpg
          // });
        }

        const s3 = new AWS.S3({
          correctClockSkew: true,
          endpoint: "https://s3.eu-central-2.wasabisys.com", //use appropriate endpoint as per region of the bucket
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: "eu-central-2",
          logger: console,
        });
        const filename = v4() + "_" + image.name;
        const uploadRequest = new AWS.S3.ManagedUpload({
          params: {
            Bucket: "wavechat",
            Key: "attachments/" + filename,
            Body: image.data,
            ACL: "public-read",
          },
          service: s3,
        });
        // uploadRequest.on("httpUploadProgress", function (event) {
        //   const progressPercentage = Math.floor(
        //     (event.loaded * 100) / event.total
        //   );
        //   console.log("Upload progress " + progressPercentage);
        // });

        // console.log("Configed and sending");

        try {
          await uploadRequest.promise();

          // console.log("Good upload");
          return res.send({
            filename,
          });
        } catch (err) {
          // console.log("UPLOAD ERROR: " + JSON.stringify(err, null, 2));
          return res.sendStatus(400);
        }
      } else {
        return res.sendStatus(400);
      }
    }
  );

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
