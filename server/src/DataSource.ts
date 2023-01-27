import { DataSource } from "typeorm";
import { User } from "./enitities/User";
import { Message } from "./enitities/Message";
import { Friendship } from "./enitities/Friendship";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: "mysql",
  password: "mysql",
  database: "discord_clone2",
  entities: [User, Message, Friendship],
  synchronize: true,
  logging: true,
});
