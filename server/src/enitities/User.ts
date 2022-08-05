import { Field, ObjectType } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({
    length: 50,
    unique: true,
  })
  username!: string;

  @Column("text")
  password!: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  email?: string;
}
