import { DataSource } from "typeorm";
import { User } from "./enitities/User";
import { Message } from "./enitities/Message";
import { Friendship } from "./enitities/Friendship";
import { Group } from "./enitities/Group";
import { Group_Has_User } from "./enitities/Group_Has_User";
import { FriendshipCheck1674906699226 } from "./migrations/1674906699226-FriendshipCheck";
import { Channel } from "./enitities/Channel";
import { Cascade1680381411813 } from "./migrations/1680381411813-Cascade";
import { Blacklist } from "./enitities/Blacklist";
import { Whitelist } from "./enitities/Whitelist";
require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: "wavechat",
  entities: [
    User,
    Message,
    Friendship,
    Group,
    Group_Has_User,
    Channel,
    Blacklist,
    Whitelist,
  ],
  migrations: [FriendshipCheck1674906699226, Cascade1680381411813],
  synchronize: true,
  logging: true,
});

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "postgres",
//   database: "wavechat",
//   entities: [User, Message, Friendship, Group, Group_Has_User],
//   synchronize: true,
//   logging: true,
// });
