import { MigrationInterface, QueryRunner } from "typeorm";

export class Cascade1680381411813 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `channel` DROP CONSTRAINT `FK_90e59c37a44fb796e67ef814b6f`;"
    );

    await queryRunner.query(
      "ALTER TABLE `group_has_user` DROP CONSTRAINT `FK_b06bffda5a627aff0e7d528c785`;"
    );

    await queryRunner.query(
      "ALTER TABLE `channel` ADD CONSTRAINT `FK_90e59c37a44fb796e67ef814b6f` FOREIGN KEY (groupId) REFERENCES `group`(id) ON DELETE CASCADE;"
    );
    await queryRunner.query(
      "ALTER TABLE `group_has_user` ADD CONSTRAINT `FK_b06bffda5a627aff0e7d528c785` FOREIGN KEY (groupId) REFERENCES `group`(id) ON DELETE CASCADE;"
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(``);
  }
}
