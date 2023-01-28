import { MigrationInterface, QueryRunner } from "typeorm";

export class FriendshipCheck1674906699226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `friendship` ADD CONSTRAINT check_user_ids CHECK (`user1Id` < `user2Id`)"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `friendship` DROP CONSTRAINT check_user_ids"
    );
  }
}
