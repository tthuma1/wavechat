import { DataSource } from "typeorm";
import { User } from "./enitities/User";
import { Message } from "./enitities/Message";
import { Friendship } from "./enitities/Friendship";
import { Group } from "./enitities/Group";
import { Group_Has_User } from "./enitities/Group_Has_User";
import { FriendshipCheck1674906699226 } from "./migrations/1674906699226-FriendshipCheck";
import { Channel } from "./enitities/Channel";
import { Channel_Has_Message } from "./enitities/Channel_Has_Messages";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: "mysql",
  password: "mysql",
  database: "discord_clone2",
  entities: [
    User,
    Message,
    Friendship,
    Group,
    Group_Has_User,
    Channel,
    Channel_Has_Message,
  ],
  migrations: [FriendshipCheck1674906699226],
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
